export const HOST = "localhost";
export const USER = "root";
export const PASSWORD = "";
export const DB = "jdihprovlampung";
export const dialect = "mysql";
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000, // maximum time, in milliseconds, that a connection can be idle before being released
};
