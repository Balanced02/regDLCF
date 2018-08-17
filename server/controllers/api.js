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
      return res.status(500).json({ err: err, message: err.message });
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
    return res.status(500).json({
      message: "Error Loading Participant List",
      error: err.message
    });
  }
};

export const DeleteParticipant = (req, res) => {
  let _id = req.params.id;
  Participants.findOneAndRemove({ _id })
    .then(() =>
      res.json({
        message: "Deleted Successfully"
      })
    )
    .catch(err => {
      console.log(err);
      return res.status(500).json({
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
        let participantDetail = {};
        participantDetail["Id"] = i + 1;
        participantDetail["Full Name"] = participant._doc.fullName;
        participantDetail["Phone Number"] = participant._doc.phoneNumber;
        participantDetail["Category"] = participant._doc.category;
        participantDetail["Institution"] = participant._doc.institution;
        participantDetail["Institution Address"] =
          participant._doc.institutionAddress;
        participantDetail["State"] = participant._doc.state;
        participantDetail["Local Govt. Area"] = participant._doc.localGovtArea;
        participantDetail["Denomination"] = participant._doc.denomination;
        participantDetail["Registration Officer"] =
          participant._doc.registrationOfficer;
        participantDetail["Officer Phone No"] =
          participant._doc.registrationOfficerPhoneNumber;
        participantDetail["Languages Spoken"] =
          participant._doc.languagesSpoken;
        console.log(participantDetail)
        return participantDetail;
      }
      return participant;
    });
    var xls = json2xls(formattedParticipants, {
      style: path.join(__dirname, "styles.xml"),
      fields: 
      {  "Id": "string" ,
        "Full Name": "string" ,
        "Phone Number": "string" ,
        "Category": "string" ,
        "Institution": "string" ,
        "Institution Address": "string" ,
        "State": "string" ,
        "Local Govt. Area": "string" ,
        "Denomination": "string" ,
        "Registration Officer": "string" ,
        "Officer Phone No": "string" ,
        "Languages Spoken": 'string',
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

export const GetSummary = async (req, res) => {
  try {
    let [participantsCount, regOfficerCount] = await Promise.all([
      Participant.find().count(),
      Users.find().count()
    ]);
    return res.json({
      participantsCount,
      regOfficerCount
    });
    
  } catch (err) {
    res.status(500).json({
      err: err.message
    })
  }
};
