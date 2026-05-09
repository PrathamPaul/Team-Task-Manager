import Team from "../models/Team.js";
import { createLog } from "./activityLogcontroller.js";

const getId = (value) => value?._id || value;

const isTeamMember = (team, userId) =>
  team.members.some((member) => getId(member).toString() === userId.toString());

const getTeamQueryForUser = (user) => {
  if (user.role === "Admin") {
    return {};
  }

  if (user.role === "ProjectManager") {
    return {
      $or: [
        { createdBy: user.id },
        { members: user.id },
      ],
    };
  }

  return { members: user.id };
};

// Create new team
export const createTeam = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = new Team({
      name,
      createdBy: userId,
      members: [userId], 
    });

    await team.save();

    // Log activity
    await createLog(
      userId,
      "Create Team",
      "Team",
      team._id,
      `${req.user.name} created team "${team.name}"`
    );

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.user.id;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!isTeamMember(team, userId)) {
      team.members.push(userId);
      await team.save();

      // Log activity
      await createLog(
        userId,
        "Join Team",
        "Team",
        team._id,
        `${req.user.name} joined team "${team.name}"`
      );
    }

    res.status(200).json({ message: "Joined team successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Error joining team", error: error.message });
  }
};

export const getUserTeams = async (req, res) => {
  try {
    const query = getTeamQueryForUser(req.user);

    const teams = await Team.find(query)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error: error.message });
  }
};
