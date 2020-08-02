const { location } = window;
export function mockLocation(mockedProperties: Partial<Location>): Location {
  delete window.location;
  window.location = {
    ...location,
    ...mockedProperties
  };
  return location;
}
