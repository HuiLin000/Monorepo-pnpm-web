#!/usr/bin/env node

// import inquirer from "inquirer";

const pkg = require("../package.json");
const fs = require("fs");
const version = pkg.version;
console.log("--------------【自动版本号程序】--------------");
if (!version.match(/^[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3}/g)) {
  console.error("获取当前版本错误！请检查package.json文件");
  process.exit(1);
}
const inquirer = require("inquirer");
const shelljs = require("shelljs");
inquirer
  .prompt([
    {
      type: "list",
      name: "isChangeVersion",
      message: "是否需要变更版本号? 当前版本[" + version + "]:",
      default: 0,
      choices: [
        { value: 0, name: "No" },
        { value: 1, name: "Yes" }
      ]
    },
    {
      type: "list",
      name: "changeVersionType",
      message: "变更版本号类型:",
      default: 0,
      choices: [
        { value: 0, name: "自动变更【小版本(v1.1.X)】" },
        { value: 1, name: "自动变更【次版本(v1.X.0)】" },
        { value: 2, name: "自动变更【主版本(vX.0.0)】" },
        { value: 3, name: "手动指定版本" }
      ],
      when(answers) {
        return answers["isChangeVersion"] === 1;
      }
    },
    {
      type: "input", // 类型
      name: "newVersion", // 字段名称，在then里可以打印出来
      message: "请指定版本，当前版本[" + version + "]:", // 提示信息
      when(answers) {
        return answers["changeVersionType"] === 3;
      },
      validate: function (value) {
        // 验证是否合规
        const pass = value.match(/^[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3}/g);
        if (pass && compareVersion(value)) {
          return true;
        }
        return "输入格式错误：格式要求 【*.*.*】且必须大于当前版本号。";
      }
    }
  ])
  .then(answers => {
    if (answers["isChangeVersion"] === 1) {
      changeVersion(answers);
    }
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

/**
 * 根据类型，生成新的版本号，并更新
 * @param answers
 */
function changeVersion(answers) {
  const oldVersionArr = version.split(".");
  let newVersion = "";
  //版本号第一位 如：1.2.3 则为 1
  let firstNum = parseInt(oldVersionArr[0]);
  //版本号第二位 如：1.2.3 则为 2
  let secondNum = parseInt(oldVersionArr[1]);
  //版本号第三位 如：1.2.3 则为 3
  let thirdNum = parseInt(oldVersionArr[2]);

  switch (answers["changeVersionType"]) {
    case 0:
      newVersion = firstNum + "." + secondNum + "." + (thirdNum + 1);
      break;
    case 1:
      newVersion = firstNum + "." + (secondNum + 1) + ".0";
      break;
    case 2:
      newVersion = firstNum + 1 + ".0.0";
      break;
    case 3:
      newVersion = answers["newVersion"];
      break;
  }
  writeVersion(newVersion);
}

/**
 * 对比当前版本号
 * @param newVersion
 * @returns {boolean}
 */
function compareVersion(newVersion) {
  const versions = version.split(".");
  const newVersions = newVersion.split(".");
  let compare = true;
  for (let i = 0; i < versions.length; i++) {
    if (versions[i] > newVersions[i]) {
      compare = false;
      break;
    }
  }
  return compare;
}

/**
 * 将新的版本号写入package.json
 * @param newVersion
 */
function writeVersion(newVersion) {
  pkg.version = newVersion;
  const data = JSON.stringify(pkg, null, 2);

  fs.writeFile("./package.json", data, err => {
    // 写入失败的话。需要终止整个进程
    if (err) {
      console.error(
        "---------【自动版本号程序】package.json 文件写入失败！" + err.message
      );
      process.exit(1);
    } else {
      shelljs.exec("git add package.json", err => {
        if (err) {
          console.error(
            "---------【自动版本号程序】git add package.json 失败！请手动回退版本号" +
              err.message
          );
          process.exit(2);
        } else {
          console.log(
            `---------【自动版本号程序】版本更新完成[${version}]-->[${newVersion}]---------`
          );
        }
      });
      console.log("");
      console.log("");
      console.log("");
    }
  });
}
