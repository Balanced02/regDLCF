import regeneratorRuntime from "regenerator-runtime";
import fs from "fs";
import json2xls from "json2xls";
import path from "path";
import Users from "../models/Users";
import Participant from "../models/Participants";

export const CreateParticipant = (req, res) => {
  const user = JSON.parse(req.headers.user);
  const participantDetails = req.body;
  Participant.create({ ...participantDetails, registrationOfficer: user.sid })
    .then(data => res.json(data))
    .catch(err => {
      console.log(err);
      res.status(500).json({ err: err, message: err.message });
    });
};

export const GetParticipants = async (req, res) => {
  let page = parseInt(Number(req.params.id));
  let searchKey = req.body.searchKey;
  let searchQuery = {};
  if (searchKey) {
    let search = {
      $regex: searchKey || "",
      $options: "i"
    };
    searchQuery = {
      $or: [
        {
          sid: search
        },
        {
          fullName: search
        },
        {
          denomination: search
        },
        {
          category: search
        },
        {
          phoneNumber: search
        },
        {
          state: search
        },
        {
          localGovtArea: search
        },
        {
          institution: search
        }
      ]
    };
  }
  if (!page) {
    page = 1;
  }
  try {
    let [count, participants] = await Promise.all([
      Participant.find(searchQuery).count(),
      Participant.find(searchQuery)
        .sort("created")
        .skip(page * 25 - 25)
        .limit(25)
    ]);
    let username = await Users.find(
      {
        sid: {
          $in: participants.map(participant => participant.registrationOfficer)
        }
      },
      "fullName phoneNumber sid"
    );
    participants = participants.map(participant => {
      let userName = username.filter(
        user => user.sid === participant.registrationOfficer
      )[0];
      participant._doc.registrationOfficer = userName ? userName.fullName : "";
      participant._doc.registrationOfficerPhoneNumber = userName
        ? userName.phoneNumber
        : "";
      return participant;
    });

    return res.json({
      count,
      participants
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error Loading Participant List",
      error: err.message
    });
  }
};

export const DeleteParticipant = (req, res) => {
  let _id = req.params.id;
  Participants.findOneAndRemove({ _id })
    .then(data =>
      res.json({
        message: "Deleted Successfully"
      })
    )
    .catch(err => {
      res.status(500).json({
        message: "Unable to delete Participant",
        error: err.message
      });
    });
};

export const DownloadParticipantList = async (req, res) => {
  try {
    let [count, participants] = await Promise.all([
      Participant.find().count(),
      Participant.find()
    ]);
    let username = await Users.find(
      {
        sid: {
          $in: participants.map(participant => participant.registrationOfficer)
        }
      },
      "fullName phoneNumber sid"
    );
    participants = participants.map(participant => {
      let userName = username.filter(
        user => user.sid === participant.registrationOfficer
      )[0];
      participant._doc.registrationOfficer = userName ? userName.fullName : "";
      participant._doc.registrationOfficerPhoneNumber = userName
        ? userName.phoneNumber
        : "";
      return participant;
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats");

    const formattedParticipants = participants.map((participant, i) => {
      if (participant._doc) {
        delete participant._doc._id;
        delete participant._doc.sid;
        delete participant._doc._v;
        participant._doc.id = i + 1;
        return participant._doc;
      }
      delete participant._id;
      delete participant.sid;
      delete participant._v;
      participant.id = i + 1;
      return participant;
    });
    var xls = json2xls(formattedParticipants, {
      style: path.join(__dirname, "style.xml"),
      fields: {
        id: "Id",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        institution: "Institution/PPA",
        state: "State of Origin",
        localGovtArea: "Local Govt. Area",
        denomination: "Denomination",
        registrationOfficer: "Registration Officer",
        registrationOfficerPhoneNumber: "Reg. Officer Num.",
        languagesSpoken: "Languages",
        institutionAddress: "Institution/PPA Address",
        category: "Category"
      }
    });
    fs.writeFileSync(
      path.join(__dirname, "participantList.xlsx"),
      xls,
      "binary"
    );
    return res.download(path.join(__dirname, "participantList.xlsx"));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error Downloading Participant List",
      error: err.message
    });
  }
};
