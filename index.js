"use strict";

const csv = require('fast-csv');

async function getData(filename) { //The final result use array contains object type

    return await new Promise((resolve, reject) => {

        let tempData = [];
        csv.fromPath(filename, {
                headers: true
            })
            .on("data", (row) => {
                if (row.ID)
                    tempData.push(row);
            })
            .on("end", () => {
                resolve(tempData);
            })
            .on("error", (err) => {
                reject(err);
            })

    });
}

async function writeData(data, filename) {

    return await new Promise((resolve, reject) => {
        csv.writeToPath(filename, data, {
                headers: true
            })
            .on("finish", () => {
                console.log("write data done");
                resolve();
            }).on("error", (err) => {
                reject(err);
            });

    });
}

async function deleteDataByIdArray(IDArray, filename) {
    //first get object from file and subtract datas whose id in idArray ,finally send to file

    return await new Promise((resolve, reject) => {
        getData(filename).then(async srcData => {

            let tempData = [];
            for (let i = 0; i < srcData.length; i++) {
                let flag = 1;
                for (let j = 0; j < IDArray.length; j++) {

                    if (parseInt(srcData[i].ID) == parseInt(IDArray[j])) {
                        flag = 0;
                        break;
                    }

                }
                if (flag)
                    tempData.push(srcData[i]);
            }

            await writeData(tempData, filename)
                .then(() => {
                    console.log("delet data finish");
                    resolve(tempData);
                }).catch(err => {
                    console.log("write file occure error");
                    reject(err);
                })

        }).catch(err => {
            console.log("read file occure error");
            reject(err);
        })
    });
}


// dstFileName = data + srcFileName
async function addData(addData, srcFileName, dstFileName) {

    return await new Promise((resolve, reject) => {
        //first get srcFileName data and add addData ,finally send to dstFileName
        getData(srcFileName).then(async srcData => {

            let tempData = srcData.concat(addData);
            await writeData(tempData, dstFileName)
                .then(() => {
                    console.log("add data finish");
                    resolve(tempData);
                }).catch(err => {
                    console.log("write file occure error");
                    reject(err);
                })

        }).catch(err => {
            console.log("read file occure error");
            reject(err);
        });

    });
}

exports = module.exports = {
    getData: getData,
    writeData: writeData,
    addData: addData,
    deleteData: deleteDataByIdArray
}



/* deleteDataByIdArray(["0030",17,16,15,14,18], "test2.csv")
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    }) */


// test example

/* const testData = [{
    ID: '0030',
    BarCode: 'ABCD18',
    'First Name': 'Kate',
    'Last Name': 'sdf',
    Phone: '123456718',
    Email: 'a1@b.c18',
    Title: 'Admin Assistant',
    Division: 'Seatle'
}]; */


/* addData(testData, "test2.csv", "test1.csv")
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    }); */


/* getData("test2.csv").then(data => {

    for (let i = 0; i < data.length; i++) {
        console.log(data[i]);
        console.log("\n");
    }

}).catch(err => {
    console.log(err);
}); */


/* writeData(testData,"test1.csv").catch(err => {
    console.log(err);
}) */