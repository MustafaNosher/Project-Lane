import mongoose from "mongoose";
import dotenv from "dotenv";
import Workspace from "./src/models/workspace.js";
import User from "./src/models/user.js";

dotenv.config({ path: "server/.env" });

const verifyWorkspaceAccess = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    // 1. Create a mock user
    const mockUser = await User.create({
      name: "Test User",
      email: `testuser_${Date.now()}@example.com`,
      password: "password123",
    });
    console.log("Created mock user:", mockUser._id);

    // 2. Create workspaces
    // Workspace A: User is owner, but NOT in members list
    const workspaceA = await Workspace.create({
      name: "Workspace A (Owner only)",
      owner: mockUser._id,
      members: [], // Deliberately empty to test owner check
    });
    console.log("Created Workspace A:", workspaceA._id);

    // Workspace B: User is member
    const workspaceB = await Workspace.create({
      name: "Workspace B (Member)",
      owner: new mongoose.Types.ObjectId(), // Some other owner
      members: [{ user: mockUser._id, role: "member" }],
    });
    console.log("Created Workspace B:", workspaceB._id);

    // Workspace C: User is neither
    const workspaceC = await Workspace.create({
      name: "Workspace C (No Access)",
      owner: new mongoose.Types.ObjectId(),
      members: [],
    });
    console.log("Created Workspace C:", workspaceC._id);

    // 3. Test Query (Simulating getWorkspaces)
    console.log("\nTesting getWorkspaces query...");
    const workspaces = await Workspace.find({
      $or: [
        { owner: mockUser._id },
        { "members.user": mockUser._id }
      ]
    });

    const foundIds = workspaces.map(w => w._id.toString());
    console.log("Found Workspaces:", foundIds);

    const hasA = foundIds.includes(workspaceA._id.toString());
    const hasB = foundIds.includes(workspaceB._id.toString());
    const hasC = foundIds.includes(workspaceC._id.toString());

    console.log("\n--- Verification Results ---");
    console.log(`Workspace A (Owner check): ${hasA ? "PASSED" : "FAILED"}`);
    console.log(`Workspace B (Member check): ${hasB ? "PASSED" : "FAILED"}`);
    console.log(`Workspace C (No access check): ${!hasC ? "PASSED" : "FAILED"}`);

    // 4. Cleanup
    await User.findByIdAndDelete(mockUser._id);
    await Workspace.findByIdAndDelete(workspaceA._id);
    await Workspace.findByIdAndDelete(workspaceB._id);
    await Workspace.findByIdAndDelete(workspaceC._id);
    console.log("\nCleanup done.");

    if (hasA && hasB && !hasC) {
        console.log("OVERALL RESULT: SUCCESS");
        process.exit(0);
    } else {
        console.log("OVERALL RESULT: FAILURE");
        process.exit(1);
    }

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

verifyWorkspaceAccess();
