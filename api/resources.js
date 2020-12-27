const format = require("date-fns/format");
const _ = require("lodash");
const { FORMAT_DATE_TIME } = require("./utils");
const axios = require("./request");

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
    url: `https://api.turni.to/api/user/megatlon/service/${idClase}/slots/${fecha}`,
    method: "GET",
  }),
  reserva: (start, end, idClase) => ({
    url: `https://api.turni.to/api/user/megatlon/service/${idClase}/reservation`,
    method: "POST",
    data: { start, end },
  }),
};

module.exports = _.mapValues(endpoints, (endpointGen) =>
  _.flowRight([axios, endpointGen])
);
