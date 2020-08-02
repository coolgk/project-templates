const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const config = {
  api: {
    data: `${apiBaseUrl}/v1/data`
  }
};
