import "source-map-support/register";
import { middyfy } from "@libs/lambda";
import { DB } from "../../libs/db";

const list = async () => {
  //Obtener credenciales
  const credentials = await DB.getCredencials();
  //Asigna la base de datos.
  Object.assign(credentials, { database: "db_citas" });

  //Conexion con la BD
  const connection = await DB.getConnection(credentials);

  //Query a la BD
  const result = await DB.executeStatement(
    connection,
    "select idMedico, nombreCompleto from medico",
    {}
  );
  console.log("result", result);

  connection.end();
  return result;
};

export const main = middyfy(list);
