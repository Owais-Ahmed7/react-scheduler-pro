const fs = require("fs");
const path = require("path");

const init = async () => {
  try {
    const base = path.resolve("");
    const files = ["LICENSE", "README.md"];
    for (const file of files) {
      await fs.promises.copyFile(path.join(base, file), path.join(base, "dist", file));
    }

    // clean up package.json on the fly
    const packg = await fs.promises.readFile(path.join(base, "package.json"), {
      encoding: "utf-8",
    });
    const obj = JSON.parse(packg);
    delete obj.scripts;
    delete obj.devDependencies;
    delete obj["lint-staged"];
    obj.homepage = "https://github.com/Owais-Ahmed7/react-scheduler-pro#readme";

    await fs.promises.writeFile(path.join(base, "dist", "package.json"), JSON.stringify(obj), {
      encoding: "utf-8",
    });
  } catch (error) {
    throw error;
  }
};

init();
