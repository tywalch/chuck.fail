function getHost() {
  return window.location.href.includes('localhost')
  ? 'https://poetic-crisp-7531f4.netlify.app/'
  : `https://${window.location.host}/`;
}

const vacationEndpoint = `${getHost()}.netlify/functions/vacation`;

const getHoursAgo = (num: number = 1) => Date.now() - (1000 * 60 * 60 * num);
const getDistance = (previous: number, current: number) => {
  return Math.max(Math.ceil((current - previous) / 1000 / 60 / 60), 0);
}

export async function getMostRecentVacationDatetime(): Promise<number> {
  return fetch(vacationEndpoint)
      .then(resp => resp.json())
      .then(payload => {
        return payload.data.datetime ?? Date.now();
      })
      .catch(err => {
        console.log('error getting more recent vacation time', err);
        return getHoursAgo(120);
      })
      .then((previous) => getDistance(previous, Date.now()));
}

export async function resetRecentVacation() {
  await fetch(vacationEndpoint, { method: 'POST' })
    .then(resp => resp.json())
    .then(payload => {
      if (!payload.success) {
        throw new Error(`Failed to get latest vacation day: ${payload.message}`);
      }
    });
}
