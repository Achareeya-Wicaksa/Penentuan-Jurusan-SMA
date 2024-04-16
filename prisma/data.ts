const extLinkQuery = (label: string, query: string) => {
  const encodedQuery = encodeURIComponent(`Penjelasan tentang ${query}`);
  return `<a href="${`https://www.bing.com/search?q=${encodedQuery}&setLang=id`}" target="_blank">${label}</a>`;
};

export const symptomsRawData = [
  {
    code: 1,
    info: "Bintik berwarna coklat akibat tusukan pada buah",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689179233/symptoms/1.jpg",
  },
  {
    code: 2,
    info: "Buah mengalami pembusukan",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1688999771/symptoms/2.webp",
  },
  {
    code: 3,
    info: "Bintik-bintik berwarna hitam terlihat pada biji buah yang masih muda",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689175269/symptoms/3.jpg",
  },
  {
    code: 4,
    info: "Buah memiliki bercak berwarna coklat",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 5,
    info: "Buah berguguran",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 6,
    info: "Serbuk putih terlihat pada batang, daun, dan buah",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1688999772/symptoms/6.webp",
  },
  {
    code: 7,
    info: "Banyak semut terlihat berkerumun di tanaman",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1688999772/symptoms/7.webp",
  },
  {
    code: 8,
    info: "Kerontokan terjadi saat bunga mulai muncul",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689002742/symptoms/8.webp",
  },
  {
    code: 9,
    info: "Bakal buah mengalami proses pengguguran",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689002962/symptoms/9.webp",
  },
  {
    code: 10,
    info: "Daun memiliki lubang-lubang kecil yang terlihat",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689176587/symptoms/10%2C17.png",
  },
  {
    code: 11,
    info: "Pucuk daun terlihat menggulung",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 12,
    info: "Daun mengalami kerutan dan menggulung",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689174641/symptoms/14.jpg",
  },
  {
    code: 13,
    info: "Daun mengalami kerontokan",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 14,
    info: "Daun mengering",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689174641/symptoms/default.webp",
  },
  {
    code: 15,
    info: "Buah terdapat lubang bekas gigitan berukuran kecil",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 16,
    info: "Daun memiliki bercak berwarna merah bata",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1688999772/symptoms/16.webp",
  },
  {
    code: 17,
    info: "Daun memiliki bercak kering berwarna putih berbentuk oval",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689176587/symptoms/10%2C17.png",
  },
  {
    code: 18,
    info: "Daun menguning",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689003758/symptoms/18.webp",
  },
  {
    code: 19,
    info: "Terdapat lapisan seperti arang berwarna hitam pada daun",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689004258/symptoms/19.webp",
  },
  {
    code: 20,
    info: "Terdapat bercak yang banyak berwarna hitam pada daun",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689005022/symptoms/20.webp",
  },
  {
    code: 21,
    info: "Daun menjadi sobek",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689178813/symptoms/21.jpg",
  },
  {
    code: 22,
    info: "Daun berlubang besar",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1688999771/symptoms/22.webp",
  },
  {
    code: 23,
    info: "Terdapat bintik bintik memar pada kulit buah",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689178215/symptoms/23.webp",
  },
  {
    code: 24,
    info: "Bintik-bintik hitam pada daun, tangkai, atau kulit buah",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689174988/symptoms/24.webp",
  },
  {
    code: 25,
    info: "Pertumbuhan tanaman terasa lambat",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 26,
    info: "Akar berubah warna menjadi warna hitam atau coklat",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 27,
    info: "Beberapa bagian tanaman menjadi layu",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
  {
    code: 28,
    info: "Bercak kecil sebesar ukuran jarum",
    imageUrl:
      "https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
  },
];

export const pestsAndDeseasesRawData = [
  {
    code: 1,
    name: "Hama Lalat Buah",
    solution: `
      <ol>
        <li>
          <p>Membersihkan area sekitar tanaman</p>
          <p>Pastikan area sekitar tanaman jambu kristal selalu bersih dari sisa-sisa buah yang jatuh atau buah yang busuk. Sisa-sisa buah yang jatuh dapat menjadi tempat berkembang biaknya hama lalat buah.</p>
        </li>
        <li>
          <p>Pemangkasan cabang dan daun yang terinfeksi</p>
          <p>Cabang atau daun yang terinfeksi oleh hama lalat buah harus segera dipangkas dan dibuang jauh dari tanaman jambu kristal.</p>
        </li>
        <li>
          <p>Menggunakan perangkap lalat buah</p>
          <p>Anda dapat menggunakan perangkap lalat buah untuk menangkap hama lalat buah yang berkeliaran di sekitar tanaman. Pastikan untuk membersihkan perangkap secara teratur.</p>
        </li>
        <li>
          <p>Penggunaan Insektisida</p>
          <p>Anda juga dapat menggunakan insektisida untuk membunuh hama lalat buah. Namun, pastikan untuk memilih insektisida yang aman dan tidak merusak tanaman jambu kristal.</p>
        </li>
        <li>
          <p>Memanfaatkan predator alami</p>
          <p>Beberapa jenis serangga seperti lebah dan capung dapat menjadi predator alami dari hama lalat buah. Anda dapat mempertimbangkan untuk menanam tanaman-tanaman tertentu yang menarik kedatangan serangga-serangga tersebut.</p>
        </li>
        <li>
          <p>Menerapkan rotasi tanaman</p>
          <p>Hama lalat buah dapat bertahan hidup dalam tanah untuk waktu yang lama. Oleh karena itu, melakukan rotasi tanaman dapat membantu mengurangi keberadaan hama lalat buah pada tanaman jambu kristal.</p>
        </li>
        <li>
          <p>Penggunaan Kamper</p>
          <p>Bau pada kamper menyebabkan hama menjauh dari tanaman. Gantungkan kamper menggunakan wadah yang tahan air serta buat lubang-lubah kecil dibawah wadah agar aroma kamper dapat menyebar dan air tidak mudah masuk</p>
        </li>
      </ol>
      `,
    activeIngredient: `
      <ol>
        <li>
        ${extLinkQuery("Mancozeb 80%", "Mancozeb")}
        </li>
        <li>
        ${extLinkQuery("Profenofos", "Profenofos")}
        </li>
        <li>
        ${extLinkQuery("Abamektin", "Abamektin")}
        </li>
      </ol>
      `,
  },
  {
    code: 2,
    name: "Hama Kutu Putih",
    solution: `
      <ol>
        <li>
          <p>Mengurangi kepadatan tajuk tanaman</p>
          <p>Karena hama ini menyukai kelembaban, maka dianjurkan untuk mengurangi kepadatan tajuk tanaman dan buah, serta menjaga kebersihan lingkungan di sekitar tanaman.</p>
        </li>
        <li>
          <p>Membersihkan bagian tanaman yang terinfeksi</p>
          <p>Menjaga kebersihan tanaman dengan cara membuang daun atau bagian tanaman yang telah mati atau terinfeksi kutu putih.</p>
        </li>
        <li>
          <p>Memangkas cabang yang terinfeksi</p>
          <p>Memangkas cabang yang terinfeksi kutu putih untuk mengurangi populasi kutu putih dan mencegah penyebaran ke bagian tanaman lain.</p>
        </li>
      </ol>
      `,
    activeIngredient: `
      <ol>
        <li>
        ${extLinkQuery("Deltametrin 20gr/ltr", "Deltametrin")}
        </li>
      </ol>
      `,
  },
  {
    code: 3,
    name: "Hama Ulat Kantong",
    solution: `
      <ol>
        <li>
          <p><strong>Manual Pemindahan Kantung</strong></p>
          <p>Jika hanya ada sedikit kantung ulat kantong pada tanaman anda, anda bisa mencoba untuk memindahkan kantung-kantung tersebut menggunakan tangan ke daun atau tanaman lain yang tidak terlalu penting. Hal ini dilakukan agar ulat kantong tidak meluas ke tanaman lain.</p>
        </li>
        <li>
          <p><strong>Penggunaan Insektisida</strong></p>
          <p>Jika serangan ulat kantong sudah sangat parah, Anda bisa menggunakan insektisida yang direkomendasikan oleh sistem. Pastikan Anda membaca instruksi dan dosis penggunaannya dengan benar, dan mengenakan perlengkapan keselamatan saat menggunakan insektisida.</p>
        </li>
      </ol>
      `,
    activeIngredient: `
      <ol>
        <li>
        ${extLinkQuery("Deltametrin 20gr/ltr", "Deltametrin")}
        </li>
      </ol>
      `,
  },
  {
    code: 4,
    name: "Hama Belalang",
    solution: `
      <ol>
        <li>
          <p>Tanam tumbuhan pengusir belalang, seperti tanaman lavender atau serai, di sekitar area pertanian atau kebun Anda. Belalang akan menghindari daerah yang memiliki bau-bauan dari tanaman-tanaman ini.</p>
        </li>
        <li>
          <p>Pasang perangkap belalang di area pertanian atau kebun Anda. Perangkap belalang dapat dibuat dengan menggunakan botol plastik bekas yang diberi cairan manis atau minuman beralkohol sebagai umpannya.</p>
        </li>
        <li>
          <p>Gunakan insektisida pengusir belalang yang mengandung bahan aktif seperti lambda-cyhalothrin atau deltamethrin. Insektisida ini biasanya tersedia dalam bentuk cairan atau serbuk yang dapat dicampur dengan air.</p>
          <p>Sebelum menggunakan insektisida, pastikan Anda membaca instruksi dan dosis penggunaannya dengan benar, serta mengenakan perlengkapan keselamatan seperti masker dan sarung tangan.</p>
        </li>
      </ol>
      `,
    activeIngredient: `
      <ol>
        <li>
          ${extLinkQuery("Deltamethrin 2.5gr/ltr", "Deltamethrin")}
        </li>
        <li>
          ${extLinkQuery("Sihalotrin 5gr/ltr", "Sihalotrin")}
        </li>
      </ol>
    `,
  },
  {
    code: 5,
    name: "Penyakit Karat Daun",
    solution: `
    <ol>
      <li>
        <p>Menjaga kebersihan lingkungan sekitar tanaman</p>
        <p>Karat daun seringkali menyerang tanaman yang tumbuh di lingkungan yang lembab dan kotor. Oleh karena itu, pastikan lingkungan sekitar tanaman tetap bersih dan kering.</p>
      </li>
      <li>
        <p>Membuang daun-daun yang terinfeksi</p>
        <p>Jika sudah ada daun yang terinfeksi karat daun, sebaiknya segera dipotong dan dibuang jauh dari tanaman. Hal ini bertujuan agar spora penyebab penyakit tidak menyebar ke daun-daun lain.</p>
      </li>
      <li>
        <p>Penggunaan fungisida</p>
        <p>Jika serangan penyakit sudah parah, Anda bisa menggunakan fungisida yang direkomendasikan oleh sistem. Pastikan Anda membaca instruksi dan dosis penggunaannya dengan benar, dan mengenakan perlengkapan keselamatan saat menggunakan fungisida.</p>
      </li>
    </ol>`,
    activeIngredient: `
    <ol>
      <li> ${extLinkQuery("Propineb 70%", "Propineb")}</li>
      <li> ${extLinkQuery("Tebuconazole 25 gr/ltr", "Tebuconazole")}</li>
      <li>${extLinkQuery("Triadimenol 25 gr/ltr", "Triadimenol")}</li>
    </ol>
    `,
  },
  {
    code: 6,
    name: "Penyakit Embun Jelaga",
    solution: `
      <ol>
        <li>
          <p>Menjaga sirkulasi udara di sekitar tanaman</p>
          <p>
            Embun jelaga seringkali menyerang tanaman yang tumbuh di daerah yang lembab dan memiliki sirkulasi udara yang buruk. Oleh karena itu, pastikan sirkulasi udara di sekitar tanaman tetap baik dengan melakukan pemangkasan daun-daun yang terlalu rapat dan menjaga jarak tanam yang cukup antara satu tanaman dengan tanaman lainnya.
          </p>
        </li>
        <li>
          <p>Mengurangi kelembaban di sekitar tanaman</p>
          <p>
            Embun jelaga dapat muncul pada daun yang basah atau lembab. Oleh karena itu, pastikan tanaman tidak terlalu sering disiram dan menghindari penyiraman pada malam hari. Jika terlalu lembab, dapat mempertimbangkan penggunaan pengering udara atau dehumidifier di sekitar tanaman.
          </p>
        </li>
        <li>
          <p>Penggunaan fungisida</p>
          <p>
            Jika serangan penyakit sudah parah, Anda bisa menggunakan fungisida yang direkomendasikan oleh sistem. Pastikan Anda membaca instruksi dan dosis penggunaannya dengan benar, dan mengenakan perlengkapan keselamatan saat menggunakan fungisida.
          </p>
        </li>
      </ol>
    `,
    activeIngredient: `
      <ol>
        <li> ${extLinkQuery("Propineb 70%", "Propineb")}
        </li>
        <li>
          ${extLinkQuery("Triforine 50 gr/ltr", "Triforine")}
        </li>
        <li>
          ${extLinkQuery("Tebuconazole 25 gr/ltr", "Tebuconazole")}
        </li>
      </ol>
    `,
  },
  {
    code: 7,
    name: "Penyakit Busuk Buah",
    solution: `
      <ol>
        <li>
          <p>Memetik buah yang sudah matang</p>
          <p>Pada saat panen, pastikan Anda memetik buah yang sudah matang sepenuhnya. Buah yang masih setengah matang atau belum matang dapat membusuk lebih cepat, sehingga menjadi mudah terserang penyakit busuk buah.</p>
        </li>
        <li>
          <p>Menjaga kebersihan lingkungan</p>
          <p>Pastikan lingkungan sekitar kebun tetap bersih dan terjaga. Buang daun atau sisa-sisa tanaman yang sudah mati, sehingga tidak menimbulkan kelembaban yang berlebihan dan mempercepat perkembangan jamur.</p>
        </li>
        <li>
          <p>Memisahkan buah yang terinfeksi</p>
          <p>Jika ada buah yang sudah terinfeksi penyakit busuk buah, segera pisahkan dari buah yang sehat. Hal ini dapat membantu mengurangi penyebaran penyakit ke buah-buah yang masih sehat.</p>
        </li>
        <li>
          <p>Penggunaan fungisida</p>
          <p>Jika serangan penyakit sudah parah, Anda bisa menggunakan fungisida yang direkomendasikan oleh sistem. Pastikan Anda membaca instruksi dan dosis penggunaannya dengan benar, dan mengenakan perlengkapan keselamatan saat menggunakan fungisida.</p>
        </li>
      </ol>
    `,
    activeIngredient: `
      <ol>
        <li>
          ${extLinkQuery("Mancozeb 50 gr/ltr", "Mancozeb")}
        </li>
        <li>
          ${extLinkQuery("Mancozeb 80wp", "Mancozeb")}
        </li>
      </ol>
    `,
  },
  {
    code: 8,
    name: "Penyakit Busuk Akar",
    solution: `
      <ol>
        <li>
          <p><strong>Pengaturan Drainase</strong></p>
          <p>Penyakit busuk akar disebabkan oleh lingkungan yang lembab dan tanah yang tergenang air. Pastikan area tanaman memiliki drainase yang cukup agar air tidak tergenang di sekitar akar tanaman.</p>
        </li>
        <li>
          <p><strong>Perbaikan Tanah</strong></p>
          <p>Jika tanah di sekitar tanaman terlalu padat atau kurang subur, cobalah untuk menambahkan kompos atau pupuk organik ke dalam tanah agar tanah menjadi lebih gembur dan subur. Hal ini akan membantu memperbaiki sistem perakaran tanaman dan meningkatkan daya tahan terhadap penyakit.</p>
        </li>
        <li>
          <p><strong>Penggunaan Fungisida</strong></p>
          <p>Jika penyakit sudah sangat parah, Anda bisa menggunakan fungisida yang direkomendasikan oleh sistem. Pastikan Anda membaca instruksi dan dosis penggunaannya dengan benar, dan mengenakan perlengkapan keselamatan saat menggunakan fungisida.</p>
        </li>
      </ol>
      `,
    activeIngredient: `
      <ol>
        <li>
          ${extLinkQuery("Pupuk Hayati", "Pupuk")}
        </li>
        <li>
          ${extLinkQuery("Trikonazol 20%", "Trikonazol")}
        </li>
        <li>
          ${extLinkQuery("Mankozeb 64%", "Mankozeb")}
        </li>
      </ol>
      `,
  },
];

export const uncertaintyValueRawData = [
  { label: "Sangat Yakin", value: 0.9 },
  { label: "Yakin", value: 0.6 },
  { label: "Sedikit Yakin", value: 0.2 },
  { label: "Tidak Yakin", value: -0.4 },
  { label: "Sangat Tidak Yakin", value: -0.8 },
];

export const pestsAndDeseasesHasSymptomsRawData = [
  { pestAndDeseaseCode: 1, symptomCode: 1, expertCF: 1 },
  { pestAndDeseaseCode: 1, symptomCode: 2, expertCF: 1 },
  { pestAndDeseaseCode: 1, symptomCode: 3, expertCF: 0.4 },
  { pestAndDeseaseCode: 1, symptomCode: 4, expertCF: 1 },
  { pestAndDeseaseCode: 1, symptomCode: 5, expertCF: 1 },
  { pestAndDeseaseCode: 2, symptomCode: 6, expertCF: 1 },
  { pestAndDeseaseCode: 2, symptomCode: 7, expertCF: 0.6 },
  { pestAndDeseaseCode: 2, symptomCode: 8, expertCF: 0.6 },
  { pestAndDeseaseCode: 2, symptomCode: 9, expertCF: 0.6 },
  { pestAndDeseaseCode: 3, symptomCode: 10, expertCF: 1 },
  { pestAndDeseaseCode: 3, symptomCode: 11, expertCF: 1 },
  { pestAndDeseaseCode: 3, symptomCode: 12, expertCF: 0.4 },
  { pestAndDeseaseCode: 3, symptomCode: 13, expertCF: 0.4 },
  { pestAndDeseaseCode: 3, symptomCode: 14, expertCF: 1 },
  { pestAndDeseaseCode: 3, symptomCode: 15, expertCF: 0.4 },
  { pestAndDeseaseCode: 4, symptomCode: 21, expertCF: 0.4 },
  { pestAndDeseaseCode: 4, symptomCode: 22, expertCF: 0.4 },
  { pestAndDeseaseCode: 5, symptomCode: 4, expertCF: 1 },
  { pestAndDeseaseCode: 5, symptomCode: 14, expertCF: 0.4 },
  { pestAndDeseaseCode: 5, symptomCode: 16, expertCF: 0.4 },
  { pestAndDeseaseCode: 5, symptomCode: 17, expertCF: 1 },
  { pestAndDeseaseCode: 5, symptomCode: 18, expertCF: 0.6 },
  { pestAndDeseaseCode: 5, symptomCode: 13, expertCF: 1 },
  { pestAndDeseaseCode: 6, symptomCode: 19, expertCF: 1 },
  { pestAndDeseaseCode: 6, symptomCode: 20, expertCF: 1 },
  { pestAndDeseaseCode: 6, symptomCode: 13, expertCF: 0.8 },
  { pestAndDeseaseCode: 7, symptomCode: 13, expertCF: 0.4 },
  { pestAndDeseaseCode: 7, symptomCode: 23, expertCF: 1 },
  { pestAndDeseaseCode: 7, symptomCode: 24, expertCF: 0.6 },
  { pestAndDeseaseCode: 7, symptomCode: 18, expertCF: 1 },
  { pestAndDeseaseCode: 8, symptomCode: 13, expertCF: 1 },
  { pestAndDeseaseCode: 8, symptomCode: 25, expertCF: 1 },
  { pestAndDeseaseCode: 8, symptomCode: 26, expertCF: 1 },
  { pestAndDeseaseCode: 8, symptomCode: 27, expertCF: 1 },
  { pestAndDeseaseCode: 8, symptomCode: 28, expertCF: 1 },
];

export const userDemoAccount = {
  fullname: "SIPBUK Demo",
  role: "user",
  email: "user@sipbuk.com",
  password: "user123", // must be AES encrypted while seeding
  isVerified: true,
  verifyToken: "vt-573d4ffb-a0e6-4b02-be9e-44d487dd090f",
  authToken: null,
  passwordResetToken: null,
};

export const adminDemoAccount = {
  fullname: "SIPBUK Admin",
  role: "admin",
  email: "admin@sipbuk.com",
  password: "admin123", // must be AES encrypted while seeding
  isVerified: true,
  verifyToken: "vt-573d4ffb-a0e6-4b02-3u8d-44d487di4wsa",
  authToken: null,
  passwordResetToken: null,
};

export const userInputTemplate = (() => {
  const objectTemp = Object.create({});
  for (let n = 1; n <= 28; n++) {
    objectTemp[n] = 0;
  }
  return objectTemp;
})();
