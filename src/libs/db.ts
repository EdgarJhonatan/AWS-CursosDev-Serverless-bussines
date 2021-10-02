import * as aws from "aws-sdk";
import * as mysqlDB from "mysql";

const AwsSecretsManager = new aws.SecretsManager({ region: "us-east-2" });

export class DB {
  static getCredencials(): Promise<any> {
    return new Promise((resolve, reject) => {
      AwsSecretsManager.getSecretValue(
        { SecretId: "dev/rds/2" },
        (err, data: any) => {
          if (err) {
            reject(err);
          } else {
            let resolve_data;
            if ("SecretString" in data) {
              resolve_data = data.SecretString;
            } else {
              const buffer = new Buffer(data.SecretBinary, "base64");
              resolve_data = buffer.toString("ascii");
            }
            //console.log("resolve_data", resolve_data);
            const { username, password, host, port } = JSON.parse(resolve_data);
            resolve({ user: username, password, host, port });
          }
        }
      );
    });
  }

  static async getConnection(credentials: {
    user: string;
    password: string;
    host: string;
    database: string;
  }) {
    return await mysqlDB.createConnection(credentials);
  }

  static async executeStatement(
    connection,
    statement,
    bindParameters
  ): Promise<any> {
    const query = this.bindQueryParameters(
      connection,
      statement,
      bindParameters
    );

    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static bindQueryParameters(connection, statement, bindParameters = {}) {
    let bindSQL = statement;
    for (const prop in bindParameters) {
      const value = connection.escape(bindParameters[prop]);
      bindSQL = bindSQL.replace(`:${prop}`, value);
    }

    return bindSQL;
  }
}
