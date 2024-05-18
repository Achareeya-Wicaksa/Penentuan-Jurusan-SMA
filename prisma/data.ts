const extLinkQuery = (label: string, query: string) => {
  const encodedQuery = encodeURIComponent(`Penjelasan tentang ${query}`);
  return `<a href="${`https://www.bing.com/search?q=${encodedQuery}&setLang=id`}" target="_blank">${label}</a>`;
};


export const uncertaintyValueRawData = [
  { label: "Sangat Setuju", value: 0.9 },
  { label: "Setuju", value: 0.6 },
  { label: "Yakin", value: 0.2 },
  { label: "Tidak Setuju", value: -0.4 },
  { label: "Sangat Tidak Setuju", value: -0.8 },
];
