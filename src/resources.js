const format = require("date-fns/format");
const { FORMAT_DATE_TIME } = require("./utils/date");
const axios = require("./request");
const _ = require("lodash");

const endpoints = {
  misTurnos: () => ({
    method: "GET",
    url: `https://api.turni.to/api/user/reservation?max=10&offset=0&dateFrom=${format(
      new Date(),
      FORMAT_DATE_TIME
    )}`,
  }),
  profile: () => ({
    url: "https://api.turni.to/api/user/person",
    method: "GET",
  }),
  fechas: (idClase) => ({
    url: `https://api.turni.to/api/user/megatlon/service/${idClase}`,
    method: "GET",
  }),
  turnos: (fecha, idClase) => ({
    url: `https://api.turni.to/api/user/megatlon/service/${idClase}/slots/${fecha}`, // 2020-12-28
    method: "GET",
  }),
  reserva: (start, end, idClase) => ({
    url: `https://api.turni.to/api/user/megatlon/service/${idClase}/reservation`,
    method: "POST",
    data: { start, end }, // {"start":"2020-12-28T07:00","end":"2020-12-28T08:00"}
  }),
};

module.exports = _.mapValues(endpoints, (endpointGen) =>
  _.flowRight([axios, endpointGen])
);
