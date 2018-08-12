import regeneratorRuntime from "regenerator-runtime";
import Users from "../models/Users";
import Participant from "../models/Participants";

export const CreateParticipant = (req, res) => {
  const user = JSON.parse(req.headers.user);
  console.log(user);
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

export const DeleteParticipant = (req, res, result) => {
  console.log(result);
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
