const extLinkQuery = (label: string, query: string) => {
  const encodedQuery = encodeURIComponent(`Penjelasan tentang ${query}`);
  return `<a href="${`https://www.bing.com/search?q=${encodedQuery}&setLang=id`}" target="_blank">${label}</a>`;
};


export const uncertaintyValueRawData = [
  { label: "Sangat Yakin", value: 0.9 },
  { label: "Yakin", value: 0.6 },
  { label: "Sedikit Yakin", value: 0.2 },
  { label: "Tidak Yakin", value: -0.4 },
  { label: "Sangat Tidak Yakin", value: -0.8 },
];
