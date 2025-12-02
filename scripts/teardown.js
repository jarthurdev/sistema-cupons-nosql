import { exec } from "child_process";

export async function teardown() {
  console.log("Teardown: removendo container e tabelas antigas...");
  try {
    await runCommand("docker rm -f dynamodb-local");
  } catch {}
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return resolve(); // ignora erros
      resolve(stdout);
    });
  });
}
