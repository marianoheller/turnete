const { parse, isSameDay, compareAsc } = require("date-fns");

const { FORMAT_DATE, FORMAT_DATE_TIME } = require("./utils");
const resources = require("./resources");

const parseDate = (dateStr) => parse(dateStr, FORMAT_DATE, new Date());
const parseDateTime = (dateStr) => parse(dateStr, FORMAT_DATE_TIME, new Date());

const compareAscDateTime = (strA, strB) =>
  compareAsc(parseDateTime(strA), parseDateTime(strB));

const classHandler = async (classId) => {
  const [{ data: misTurnosData }, { data: fechasData }] = await Promise.all([
    resources.misTurnos(),
    resources.fechas(classId),
  ]);

  const misFechasYaRegistradas = misTurnosData.elements
    .filter(({ status }) => status === "ACCEPTED")
    .map(({ start }) => parseDateTime(start));

  const fechasLibres = fechasData.dates.filter((dateStr) => {
    const parsed = parseDate(dateStr);
    return !misFechasYaRegistradas.find((d) => isSameDay(d, parsed));
  });

  console.log("misFechasYaRegistradas: ", misFechasYaRegistradas);
  console.log("fechasLibres: ", fechasLibres);

  const turnosPorDiaResponse = await Promise.all(
    fechasLibres.map((dateStr) => resources.turnos(dateStr, classId))
  );

  const turnosAReservar = turnosPorDiaResponse.reduce((acc, { data }) => {
    const availableSlots = data.slots.filter((slot) => slot.available);
    const sortedSlots = availableSlots.sort((slotA, slotB) =>
      compareAscDateTime(slotA.start, slotB.start)
    );
    const firstSlot = sortedSlots.shift();
    if (firstSlot) return [...acc, firstSlot];
    return acc;
  }, []);

  const responseReserva = await Promise.all(
    turnosAReservar.map(({ start, end }) =>
      resources.reserva(start, end, classId)
    )
  );

  return {
    turnosAReservar,
    responseReserva: responseReserva.map((r) => r.data),
  };
};

const getIds = () => {
  const ids = process.env.appids || "";
  return ids.split(",") || [];
};

module.exports = async (req, res) => {
  try {
    const ids = getIds();
    console.log("Using ids: ", ids);

    let results = [];
    for (const id of ids) {
      const _result = await classHandler(id);
      results.push(_result);
    }
    res.send(results);
  } catch (err) {
    console.error(err.message || err);
    res.send(err);
  }
};
