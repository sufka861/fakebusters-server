import { spawn } from "child_process";
import path from "path";

function get_user_me() {
  const basePath = path.join(process.cwd(), "src", "X-api");
  console.log(basePath);
  const absoluteScriptPath = path.join(basePath, "get-users-me.py");
  const pythonProcess = spawn("python", [absoluteScriptPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function get_user() {
  const basePath = path.join(process.cwd(), "src", "X-api");
  console.log(basePath);
  const absoluteScriptPath = path.join(basePath, "get-users-by-context.py");
  const pythonProcess = spawn("python", [absoluteScriptPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

export { get_user_me, get_user };
