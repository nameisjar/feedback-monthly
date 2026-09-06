"use client";

import { useState, useSyncExternalStore } from "react";

type Language = "id" | "en";

type FeedbackItem = {
  id: string;
  title: string;
  group: string;
  level: "positive" | "attention" | "technical" | "milestone" | "growth";
  keywords?: string[];
  variants: string[];
};

const languageEvent = "feedback-language-change";

function getLanguageSnapshot(): Language {
  return document.documentElement.lang === "id" ? "id" : "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

function subscribeToLanguage(callback: () => void) {
  window.addEventListener(languageEvent, callback);
  return () => window.removeEventListener(languageEvent, callback);
}

function saveLanguage(language: Language) {
  document.documentElement.lang = language;
  window.localStorage.setItem("feedback-language", language);
  window.dispatchEvent(new Event(languageEvent));
}

const sourceGroups = [
  "Keaktifan",
  "Kehadiran",
  "Fokus & Tugas",
  "Pemahaman",
  "Kemandirian",
  "Kolaborasi",
  "Ketangguhan",
  "Komunikasi",
  "Kreativitas",
  "Manajemen Proyek",
  "Strategi Belajar",
  "Keterampilan Teknis",
  "Evaluasi",
  "Kesiapan Belajar",
  "Perjalanan Belajar",
  "Pencapaian",
  "Literasi Digital",
  "Perkembangan",
  "Kendala Teknis",
  "Murid Baru",
  "Kelulusan",
  "Saran",
];

const feedbackSource: FeedbackItem[] = [
  {
    id: "excellent",
    title: "Sangat Aktif & Excellent",
    group: "Keaktifan",
    level: "positive",
    variants: [
      "{{firstname}} sangat aktif dalam setiap sesi dan sering berpartisipasi saat diskusi. Pemahaman materinya terlihat sangat baik dan tugas selalu diselesaikan dengan maksimal. Perkembangannya konsisten dan membanggakan. Pertahankan semangat belajarnya ya!",
      "{{firstname}} menunjukkan antusiasme tinggi selama kelas. Ia aktif bertanya dan mampu memahami materi dengan cepat. Tugas dikerjakan dengan tanggung jawab dan hasilnya baik. Senang melihat progresnya yang stabil dan positif.",
    ],
  },
  {
    id: "active-responsible",
    title: "Aktif & Bertanggung Jawab",
    group: "Keaktifan",
    level: "positive",
    variants: [
      "{{firstname}} cukup aktif saat pembelajaran dan tidak ragu bertanya ketika mengalami kesulitan. Tugas yang diberikan selalu diusahakan untuk diselesaikan dengan baik. Perkembangannya terlihat positif dari pertemuan ke pertemuan.",
      "{{firstname}} hadir dengan konsisten dan berpartisipasi cukup baik di kelas. Pemahaman materi sudah bagus dan tugas dikerjakan dengan tanggung jawab. Semoga bisa terus meningkatkan kepercayaan dirinya.",
    ],
  },
  {
    id: "focused-consistent",
    title: "Fokus & Konsisten",
    group: "Keaktifan",
    level: "positive",
    variants: [
      "{{firstname}} cukup fokus saat materi dijelaskan meskipun masih jarang bertanya. Tugas selalu dikerjakan dan menunjukkan perkembangan yang positif. Pemahamannya sudah baik, semoga ke depannya lebih aktif lagi.",
      "{{firstname}} mengikuti kelas dengan sikap belajar yang baik dan konsisten hadir. Walau partisipasinya belum terlalu aktif, tugas dikerjakan dengan tanggung jawab. Pertahankan konsistensinya ya!",
    ],
  },
  {
    id: "participation-push",
    title: "Perlu Dorongan Partisipasi",
    group: "Keaktifan",
    level: "growth",
    variants: [
      "{{firstname}} hadir secara rutin dan cukup fokus saat pembelajaran berlangsung. Namun, partisipasi di kelas masih perlu ditingkatkan agar pemahaman semakin maksimal. Jangan ragu untuk bertanya ya!",
      "{{firstname}} menunjukkan sikap belajar yang cukup baik, tetapi masih perlu lebih aktif dalam diskusi dan menyampaikan pendapat. Dengan lebih percaya diri, perkembangannya akan semakin optimal.",
    ],
  },
  {
    id: "low-participation",
    title: "Partisipasi Lisan Masih Terbatas",
    group: "Keaktifan",
    level: "attention",
    variants: [
      "{{firstname}} selalu hadir di kelas, namun partisipasinya masih sangat minim. Ia lebih sering mendengarkan tanpa bertanya atau berdiskusi. Diharapkan ke depannya {{firstname}} bisa lebih aktif agar pemahamannya semakin optimal.",
      "Saat pembelajaran berlangsung, {{firstname}} cenderung pasif dan belum konsisten dalam mengerjakan tugas. Perlu dorongan lebih agar berani mencoba dan bertanggung jawab terhadap tugas yang diberikan.",
    ],
  },
  {
    id: "passive",
    title: "Respons Saat Pembelajaran Belum Konsisten",
    group: "Keaktifan",
    level: "attention",
    variants: [
      "Saat kelas berlangsung, {{firstname}} cenderung pasif dan jarang memberikan respons. Untuk perkembangan yang lebih maksimal, diharapkan bisa mulai lebih terlibat dalam sesi tanya jawab dan praktik.",
      "{{firstname}} masih kurang menunjukkan keaktifan dalam kelas, baik saat diskusi maupun pengerjaan tugas. Perlu dorongan lebih agar berani mencoba dan tidak ragu bertanya ketika mengalami kesulitan.",
    ],
  },
  {
    id: "confidence",
    title: "Perlu Peningkatan Kepercayaan Diri",
    group: "Keaktifan",
    level: "growth",
    variants: [
      "Keaktifan {{firstname}} di kelas masih perlu ditingkatkan. Diharapkan dapat lebih percaya diri dalam menyampaikan pendapat serta bertanya agar proses belajar menjadi lebih efektif.",
      "{{firstname}} perlu meningkatkan konsistensi dalam berpartisipasi di kelas. Dengan lebih aktif bertanya dan mencoba mengerjakan soal secara mandiri, perkembangan belajarnya akan lebih terlihat.",
    ],
  },
  {
    id: "late",
    title: "Sering Telat",
    group: "Kehadiran",
    level: "attention",
    variants: [
      "{{firstname}} selalu berusaha mengikuti kelas dengan baik, namun masih sering datang terlambat. Diharapkan ke depannya bisa lebih tepat waktu agar tidak tertinggal materi dan dapat mengikuti pembelajaran dengan maksimal. Tetap semangat ya!",
      "{{firstname}} menunjukkan sikap belajar yang cukup baik saat sudah berada di kelas. Namun, kedisiplinan waktu masih perlu ditingkatkan karena beberapa kali datang terlambat. Semoga ke depan bisa lebih tepat waktu ya.",
      "{{firstname}} cukup fokus saat pembelajaran berlangsung, tetapi masih perlu memperbaiki kebiasaan datang terlambat. Dengan hadir tepat waktu, proses belajarnya akan lebih optimal dan pemahaman materi bisa semakin baik.",
    ],
  },
  {
    id: "absent",
    title: "Sering Absen",
    group: "Kehadiran",
    level: "attention",
    variants: [
      "{{firstname}} memiliki potensi yang baik, namun kehadiran di kelas masih belum konsisten. Beberapa kali tidak mengikuti sesi sehingga berpengaruh pada pemahaman materi. Diharapkan ke depannya bisa lebih rutin hadir agar perkembangannya lebih optimal.",
      "{{firstname}} menunjukkan kemampuan yang cukup baik saat hadir di kelas. Namun, frekuensi ketidakhadiran masih perlu diperhatikan karena dapat membuatnya tertinggal materi. Semoga ke depan bisa lebih konsisten ya.",
      "{{firstname}} memiliki sikap belajar yang baik saat mengikuti kelas, tetapi masih sering absen. Dengan kehadiran yang lebih teratur, pemahaman dan progres belajarnya tentu akan meningkat lebih maksimal.",
    ],
  },
  {
    id: "inactive-late",
    title: "Partisipasi & Ketepatan Waktu Perlu Dukungan",
    group: "Kehadiran",
    level: "attention",
    variants: [
      "{{firstname}} beberapa kali terlambat masuk kelas dan saat pembelajaran berlangsung juga kurang aktif. Ketepatan waktu dan partisipasi sangat berpengaruh terhadap pemahaman materi.",
      "Selain masih kurang aktif dalam diskusi, {{firstname}} juga perlu meningkatkan kedisiplinan waktu. Diharapkan ke depannya bisa hadir tepat waktu dan lebih terlibat dalam proses belajar.",
    ],
  },
  {
    id: "low-focus",
    title: "Fokus Belajar Perlu Ditingkatkan",
    group: "Fokus & Tugas",
    level: "attention",
    variants: [
      "{{firstname}} hadir di kelas, namun fokus selama pembelajaran masih perlu ditingkatkan. Diharapkan ke depannya bisa lebih memperhatikan materi agar pemahamannya semakin maksimal. Tetap semangat dan lebih konsentrasi ya!",
      "{{firstname}} mengikuti kelas dengan cukup baik, tetapi terkadang terdistraksi saat materi dijelaskan. Dengan meningkatkan fokus dan partisipasi, perkembangan belajarnya akan jauh lebih optimal.",
      "{{firstname}} sudah hadir secara konsisten, namun konsentrasi selama kelas masih perlu diperbaiki. Semoga ke depannya bisa lebih fokus dan aktif agar materi yang dipelajari dapat dipahami dengan lebih baik.",
    ],
  },
  {
    id: "task-consistency",
    title: "Penyelesaian Tugas Belum Konsisten",
    group: "Fokus & Tugas",
    level: "growth",
    variants: [
      "{{firstname}} selalu hadir di kelas, namun tugas yang diberikan belum sepenuhnya diselesaikan. Diharapkan ke depannya bisa lebih konsisten dalam mengerjakan latihan agar pemahaman semakin kuat. Tetap semangat ya!",
      "{{firstname}} mengikuti kelas dengan cukup baik, tetapi perlu meningkatkan tanggung jawab dalam menyelesaikan tugas. Dengan lebih konsisten berlatih, kemampuan coding-nya akan berkembang lebih cepat.",
    ],
  },
  {
    id: "inactive-task",
    title: "Partisipasi & Penyelesaian Tugas Perlu Dukungan",
    group: "Fokus & Tugas",
    level: "attention",
    variants: [
      "{{firstname}} hadir di kelas, namun partisipasinya masih minim dan tugas yang diberikan belum dikerjakan secara maksimal. Diharapkan ke depannya bisa lebih aktif serta mulai menyelesaikan tugas agar perkembangannya lebih terlihat.",
      "Saat pembelajaran berlangsung, {{firstname}} cenderung pasif dan belum konsisten dalam mengerjakan tugas. Perlu dorongan lebih agar berani mencoba dan bertanggung jawab terhadap tugas yang diberikan.",
    ],
  },
  {
    id: "inactive-camera",
    title: "Interaksi Kelas Online Masih Terbatas",
    group: "Fokus & Tugas",
    level: "attention",
    keywords: ["oncam", "kamera", "online", "respons"],
    variants: [
      "{{firstname}} sudah mengikuti kelas daring, tetapi interaksinya masih terbatas. Diharapkan ke depannya dapat memberi respons melalui suara, chat, atau cara lain yang disepakati agar pemahaman dan keterlibatannya lebih mudah dipantau.",
      "Partisipasi {{firstname}} dalam kelas daring masih perlu ditingkatkan. Semoga ke depannya semakin nyaman untuk merespons pertanyaan dan menyampaikan kendala melalui media interaksi yang tersedia.",
    ],
  },
  {
    id: "rapid-growth",
    title: "Perkembangan Pesat",
    group: "Perkembangan",
    level: "positive",
    variants: [
      "{{firstname}} menunjukkan perkembangan yang sangat signifikan dibandingkan pertemuan sebelumnya. Pemahaman materi semakin baik dan kepercayaan dirinya juga meningkat. Pertahankan semangat dan konsistensinya ya!",
      "{{firstname}} mengalami progres yang pesat dalam memahami materi. Tugas yang dikerjakan semakin rapi dan tepat. Senang sekali melihat peningkatan kemampuannya dari waktu ke waktu.",
      "{{firstname}} memperlihatkan peningkatan yang luar biasa dalam beberapa sesi terakhir. Fokus, partisipasi, dan hasil tugasnya semakin baik. Semoga terus mempertahankan semangat belajarnya.",
    ],
  },
  {
    id: "more-confident",
    title: "Mulai Lebih Percaya Diri",
    group: "Perkembangan",
    level: "positive",
    variants: [
      "{{firstname}} menunjukkan peningkatan kepercayaan diri dalam beberapa pertemuan terakhir. Ia mulai lebih berani bertanya dan mencoba menjawab pertanyaan. Perkembangannya terlihat positif dan patut diapresiasi.",
      "{{firstname}} kini terlihat lebih percaya diri saat mengikuti pembelajaran. Partisipasinya mulai meningkat dan ia tidak ragu mencoba mengerjakan soal secara mandiri. Pertahankan progres baik ini ya! 👍",
      "{{firstname}} memperlihatkan perubahan yang baik dalam hal keaktifan dan keberanian berbicara di kelas. Hal ini sangat membantu dalam memahami materi dengan lebih mendalam. Terus tingkatkan rasa percaya dirinya 💡",
    ],
  },
  {
    id: "extra-guidance",
    title: "Perlu Bimbingan Ekstra",
    group: "Perkembangan",
    level: "growth",
    variants: [
      "{{firstname}} membutuhkan pendampingan lebih dalam memahami beberapa konsep materi. Dengan bimbingan tambahan dan latihan yang konsisten, kemampuannya dapat berkembang lebih baik. Tetap semangat belajar ya! 😊",
      "{{firstname}} sudah berusaha mengikuti pembelajaran, namun masih memerlukan arahan lebih lanjut pada beberapa bagian materi. Diharapkan dengan latihan tambahan, pemahamannya bisa semakin meningkat. 👍",
      "{{firstname}} menunjukkan usaha yang baik, tetapi masih membutuhkan bimbingan ekstra untuk memperkuat dasar pemahaman materinya. Dengan dukungan dan latihan rutin, progresnya akan lebih optimal. 💪✨",
    ],
  },
  {
    id: "quick-needs-accuracy",
    title: "Cepat Memahami, Perlu Lebih Teliti",
    group: "Pemahaman",
    level: "growth",
    keywords: ["cepat", "ceroboh", "kurang teliti", "terburu-buru"],
    variants: [
      "{{firstname}} mampu memahami konsep dengan cepat dan menyelesaikan latihan dengan baik. Beberapa kesalahan kecil masih muncul karena jawabannya belum diperiksa kembali. Membiasakan diri menggunakan checklist sebelum mengumpulkan tugas akan membantu meningkatkan ketelitiannya.",
      "Pemahaman {{firstname}} terhadap materi sudah kuat dan proses pengerjaannya tergolong cepat. Agar hasilnya semakin maksimal, {{firstname}} dapat meluangkan waktu untuk menguji kembali solusi dan memperbaiki detail yang terlewat.",
    ],
  },
  {
    id: "steady-paced-progress",
    title: "Belajar Bertahap dengan Progres Stabil",
    group: "Pemahaman",
    level: "positive",
    keywords: ["lambat", "butuh waktu", "pelan", "stabil"],
    variants: [
      "{{firstname}} membutuhkan waktu untuk memahami beberapa konsep, tetapi terus menunjukkan usaha dan perkembangan yang stabil. Dengan latihan bertahap dan konsisten, pemahamannya akan semakin kuat.",
      "Proses belajar {{firstname}} berlangsung secara bertahap dan arahnya positif. Ia tetap berusaha sampai memahami materi. Mempertahankan ritme latihan yang teratur akan membantu progresnya terus berkembang.",
    ],
  },
  {
    id: "theory-to-practice",
    title: "Memahami Konsep, Perlu Penguatan Praktik",
    group: "Pemahaman",
    level: "growth",
    keywords: ["teori", "praktik", "penerapan", "implementasi"],
    variants: [
      "{{firstname}} sudah dapat menjelaskan konsep yang dipelajari dengan cukup baik. Penerapannya dalam latihan mandiri masih perlu diperkuat. Latihan dengan contoh yang bervariasi akan membantu menghubungkan pemahaman konsep dengan praktik.",
      "Pemahaman teori {{firstname}} sudah baik, tetapi ia masih memerlukan arahan ketika menerapkannya pada permasalahan baru. Dengan lebih sering membuat latihan atau proyek kecil, kemampuan praktiknya akan semakin matang.",
    ],
  },
  {
    id: "strengthen-foundations",
    title: "Dasar Konsep Perlu Diperkuat",
    group: "Pemahaman",
    level: "attention",
    keywords: ["dasar", "fondasi", "tertinggal", "belum paham"],
    variants: [
      "{{firstname}} sudah berusaha mengikuti materi, tetapi beberapa konsep dasar masih perlu diperkuat sebelum melanjutkan ke tahap berikutnya. Mengulang contoh sederhana dan berlatih sedikit demi sedikit akan membantu membangun pemahaman yang lebih kokoh.",
      "Pada materi dasar, {{firstname}} masih membutuhkan pendampingan agar dapat mengikuti latihan dengan lebih mandiri. Disarankan untuk meninjau kembali materi inti dan memastikan setiap langkah sudah dipahami sebelum menambah tingkat kesulitan.",
    ],
  },
  {
    id: "quiet-strong-understanding",
    title: "Partisipasi Tenang, Pemahaman Kuat",
    group: "Pemahaman",
    level: "positive",
    keywords: ["pendiam", "diam", "tidak banyak bicara", "hasil bagus"],
    variants: [
      "Meskipun belum banyak berpartisipasi secara lisan, {{firstname}} menunjukkan pemahaman yang baik melalui tugas dan hasil praktiknya. Semoga ke depannya semakin nyaman untuk membagikan pemikiran atau proses penyelesaiannya kepada kelas.",
      "{{firstname}} cenderung tenang selama diskusi, tetapi mampu memahami materi dan menghasilkan pekerjaan yang baik. Keberanian untuk sesekali menjelaskan strategi yang digunakan akan semakin memperkuat kemampuan komunikasinya.",
    ],
  },
  {
    id: "active-needs-concept",
    title: "Aktif Berpartisipasi, Konsep Perlu Dikuatkan",
    group: "Pemahaman",
    level: "growth",
    keywords: ["aktif", "antusias", "belum paham", "campuran"],
    variants: [
      "{{firstname}} menunjukkan antusiasme dan aktif berpartisipasi selama kelas. Agar keaktifannya diikuti pemahaman yang lebih kuat, ia perlu meninjau kembali konsep inti dan menjelaskan alasan di balik setiap langkah penyelesaian.",
      "Keberanian {{firstname}} untuk bertanya dan mencoba patut diapresiasi. Beberapa konsep masih perlu diperdalam melalui latihan terarah agar jawaban yang diberikan tidak hanya cepat, tetapi juga tepat dan berdasarkan pemahaman.",
    ],
  },
  {
    id: "independent-problem-solver",
    title: "Pemecah Masalah yang Mandiri",
    group: "Kemandirian",
    level: "positive",
    keywords: ["mandiri", "inisiatif", "problem solving", "solusi"],
    variants: [
      "{{firstname}} menunjukkan kemandirian yang baik saat menyelesaikan latihan. Ia mencoba memahami masalah, mencari alternatif solusi, dan baru meminta bantuan ketika diperlukan. Sikap ini sangat mendukung perkembangan kemampuan pemecahan masalahnya.",
      "Saat menemui tantangan, {{firstname}} mampu mencoba beberapa pendekatan secara mandiri dan menjelaskan alasan pilihannya. Pertahankan inisiatif ini sambil terus membiasakan diri mengevaluasi kelebihan setiap solusi.",
    ],
  },
  {
    id: "needs-step-guidance",
    title: "Kemandirian Belajar Perlu Dikembangkan",
    group: "Kemandirian",
    level: "growth",
    keywords: ["bergantung", "diarahkan", "langkah demi langkah", "dibantu"],
    variants: [
      "{{firstname}} dapat menyelesaikan latihan dengan baik ketika mendapat arahan bertahap. Langkah berikutnya adalah mencoba mengerjakan bagian awal secara mandiri, lalu mencatat bagian yang masih membingungkan sebelum meminta bantuan.",
      "Dengan panduan, {{firstname}} mampu mengikuti proses pengerjaan dengan cukup baik. Agar semakin mandiri, ia dapat mulai membuat rencana penyelesaian sederhana dan mencoba satu alternatif sebelum meminta petunjuk berikutnya.",
    ],
  },
  {
    id: "asks-help-early",
    title: "Perlu Mencoba Sebelum Meminta Bantuan",
    group: "Kemandirian",
    level: "growth",
    keywords: ["cepat bertanya", "langsung bertanya", "minta jawaban", "bergantung"],
    variants: [
      "{{firstname}} terbuka untuk meminta bantuan ketika mengalami kesulitan, yang merupakan sikap positif. Agar kemampuan mandirinya berkembang, ia dapat membiasakan diri membaca kembali instruksi, mencoba satu solusi, dan menyampaikan hasil percobaannya saat bertanya.",
      "{{firstname}} cukup aktif mencari bantuan, tetapi terkadang meminta petunjuk sebelum mengeksplorasi masalah. Menerapkan kebiasaan ‘baca, coba, catat, lalu bertanya’ akan membantu membangun kepercayaan diri dan strategi belajarnya.",
    ],
  },
  {
    id: "self-review-habit",
    title: "Kebiasaan Evaluasi Mandiri yang Baik",
    group: "Kemandirian",
    level: "positive",
    keywords: ["refleksi", "evaluasi", "cek ulang", "memperbaiki"],
    variants: [
      "{{firstname}} menunjukkan kebiasaan belajar yang baik dengan memeriksa kembali hasil pekerjaan dan memperbaiki kesalahan secara mandiri. Sikap reflektif ini membantu pemahamannya berkembang secara konsisten.",
      "Setelah menyelesaikan latihan, {{firstname}} mampu mengevaluasi pekerjaannya dan mengenali bagian yang perlu diperbaiki. Pertahankan kebiasaan ini karena sangat mendukung ketelitian dan kemandirian belajar.",
    ],
  },
  {
    id: "fast-needs-challenge",
    title: "Siap Mendapat Tantangan Lanjutan",
    group: "Kemandirian",
    level: "positive",
    keywords: ["cepat selesai", "bosan", "terlalu mudah", "tantangan"],
    variants: [
      "{{firstname}} dapat menyelesaikan latihan utama dengan cepat dan tepat. Ia siap mencoba tantangan lanjutan yang memiliki lebih dari satu kemungkinan solusi agar kemampuan analisis dan kreativitasnya semakin terasah.",
      "Pemahaman dan kecepatan kerja {{firstname}} sudah sangat baik. Untuk menjaga motivasinya, ia dapat mengembangkan fitur tambahan atau membuat proyek mandiri yang menerapkan konsep dalam konteks baru.",
    ],
  },
  {
    id: "perfectionism-pacing",
    title: "Hasil Teliti, Pengelolaan Waktu Perlu Dilatih",
    group: "Kemandirian",
    level: "growth",
    keywords: ["perfeksionis", "terlalu lama", "lambat mengumpulkan", "detail"],
    variants: [
      "{{firstname}} sangat memperhatikan detail dan berusaha menghasilkan pekerjaan terbaik. Agar tugas dapat selesai tepat waktu, ia perlu menentukan prioritas dan membatasi waktu untuk penyempurnaan setelah bagian utama selesai.",
      "Ketelitian {{firstname}} merupakan kekuatan yang baik, tetapi proses pengerjaan terkadang memerlukan waktu terlalu panjang. Membagi waktu menjadi tahap draf, pengujian, dan perbaikan akan membantu menjaga kualitas sekaligus ketepatan waktu.",
    ],
  },
  {
    id: "supportive-peer",
    title: "Aktif Mendukung Teman Belajar",
    group: "Kolaborasi",
    level: "positive",
    keywords: ["membantu teman", "mentor", "peduli", "kerja kelompok"],
    variants: [
      "{{firstname}} tidak hanya aktif mengikuti pembelajaran, tetapi juga bersedia membantu teman yang mengalami kesulitan. Sikap kolaboratif ini sangat positif. Pertahankan sambil tetap memberikan kesempatan kepada teman untuk mencoba menemukan jawabannya sendiri.",
      "Dalam kegiatan kelompok, {{firstname}} menunjukkan kepedulian dengan menjelaskan materi dan mendukung teman secara positif. Kemampuan bekerja sama ini menjadi kekuatan yang baik bagi perkembangan seluruh kelompok.",
    ],
  },
  {
    id: "discussion-balance",
    title: "Perlu Menyeimbangkan Peran dalam Diskusi",
    group: "Kolaborasi",
    level: "growth",
    keywords: ["dominan", "memotong", "menguasai diskusi", "terlalu aktif"],
    variants: [
      "{{firstname}} memiliki banyak ide dan aktif menyampaikannya dalam diskusi. Agar kerja kelompok semakin efektif, ia perlu memberi ruang kepada teman untuk berbicara, mendengarkan sampai selesai, dan membantu merangkum berbagai pendapat.",
      "Antusiasme {{firstname}} saat berdiskusi merupakan kekuatan yang baik. Langkah berikutnya adalah menyeimbangkan kontribusi dengan mengajak anggota lain menyampaikan ide dan mempertimbangkan solusi kelompok sebelum mengambil keputusan.",
    ],
  },
  {
    id: "group-participation",
    title: "Kontribusi dalam Kelompok Perlu Ditingkatkan",
    group: "Kolaborasi",
    level: "growth",
    keywords: ["pasif kelompok", "kerja kelompok", "tidak ikut", "kolaborasi"],
    variants: [
      "{{firstname}} sudah mengikuti kegiatan kelompok, tetapi kontribusinya masih terbatas. Memilih satu peran yang jelas, seperti pencatat, penguji, atau penyaji, dapat membantunya lebih terlibat dan percaya diri.",
      "Dalam kerja kelompok, {{firstname}} masih perlu didorong untuk menyampaikan ide dan mengambil bagian dalam proses pengerjaan. Memulai dari tugas kecil yang terukur akan membantu meningkatkan rasa nyaman dan tanggung jawabnya.",
    ],
  },
  {
    id: "receptive-to-feedback",
    title: "Menerapkan Masukan dengan Baik",
    group: "Kolaborasi",
    level: "positive",
    keywords: ["feedback", "masukan", "revisi", "mau belajar"],
    variants: [
      "{{firstname}} menerima masukan dengan sikap terbuka dan mampu menerapkannya pada pekerjaan berikutnya. Kemampuan mendengarkan, mengevaluasi, dan melakukan perbaikan ini mendukung progres belajarnya secara nyata.",
      "Setelah mendapat umpan balik, {{firstname}} dapat mengenali bagian yang perlu diperbaiki dan menghasilkan revisi yang lebih baik. Pertahankan sikap terbuka ini sambil mulai melatih kemampuan menilai pekerjaan sendiri.",
    ],
  },
  {
    id: "explains-reasoning",
    title: "Mampu Menjelaskan Proses Berpikir",
    group: "Kolaborasi",
    level: "positive",
    keywords: ["komunikasi", "presentasi", "menjelaskan", "alasan"],
    variants: [
      "{{firstname}} mampu menjelaskan langkah penyelesaian dan alasan di balik pilihannya dengan runtut. Kemampuan ini menunjukkan pemahaman yang baik sekaligus membantu teman mengikuti proses berpikirnya.",
      "Saat mempresentasikan hasil, {{firstname}} dapat menyampaikan ide dengan jelas dan menanggapi pertanyaan secara relevan. Terus kembangkan kemampuan ini dengan membandingkan beberapa pendekatan yang mungkin digunakan.",
    ],
  },
  {
    id: "persistent-debugging",
    title: "Tekun Menghadapi Kesulitan",
    group: "Ketangguhan",
    level: "positive",
    keywords: ["pantang menyerah", "tekun", "debugging", "error"],
    variants: [
      "Saat menemui kesulitan, {{firstname}} tetap tenang dan mencoba beberapa cara sampai menemukan penyebab masalah. Ketekunan ini merupakan modal penting untuk mengembangkan kemampuan pemecahan masalah.",
      "{{firstname}} menunjukkan ketangguhan yang baik ketika hasil percobaan belum sesuai harapan. Ia bersedia membaca kembali instruksi, menguji solusi, dan belajar dari kesalahan tanpa mudah menyerah.",
    ],
  },
  {
    id: "frustrated-by-errors",
    title: "Perlu Strategi Saat Menghadapi Error",
    group: "Ketangguhan",
    level: "growth",
    keywords: ["mudah menyerah", "frustrasi", "emosi", "error", "kesal"],
    variants: [
      "{{firstname}} sudah mampu mengikuti materi dengan cukup baik. Saat menemui error, ia masih memerlukan dorongan untuk berhenti sejenak, membaca pesan kesalahan, dan mencoba satu perbaikan pada satu waktu. Strategi ini akan membantu membangun ketenangan dan kemandiriannya.",
      "Ketika solusi pertama belum berhasil, {{firstname}} terkadang kehilangan kepercayaan diri. Dengan membagi masalah menjadi langkah kecil dan mencatat apa yang sudah dicoba, ia akan lebih mudah melihat progres dan menemukan alternatif berikutnya.",
    ],
  },
  {
    id: "learns-from-mistakes",
    title: "Belajar Positif dari Kesalahan",
    group: "Ketangguhan",
    level: "positive",
    keywords: ["salah", "revisi", "bangkit", "refleksi"],
    variants: [
      "{{firstname}} mampu menyikapi kesalahan sebagai bagian dari proses belajar. Ia bersedia meninjau kembali pekerjaannya, memahami penyebab kesalahan, dan mencoba solusi yang lebih tepat.",
      "Setelah mengalami kesulitan, {{firstname}} dapat kembali mencoba dengan strategi yang lebih baik. Sikap terbuka terhadap kesalahan ini membantu membangun pemahaman yang lebih kuat dan tahan lama.",
    ],
  },
  {
    id: "inconsistent-motivation",
    title: "Semangat Belajar Belum Konsisten",
    group: "Ketangguhan",
    level: "growth",
    keywords: ["motivasi", "mood", "naik turun", "tidak konsisten"],
    variants: [
      "{{firstname}} dapat menunjukkan antusiasme dan hasil yang baik ketika sedang terlibat penuh, tetapi semangat belajarnya belum konsisten di setiap pertemuan. Menetapkan target kecil untuk setiap sesi dapat membantu menjaga ritme dan rasa pencapaiannya.",
      "Potensi {{firstname}} terlihat saat ia fokus dan berusaha menyelesaikan tantangan. Agar progresnya lebih stabil, ia dapat menggunakan rutinitas belajar singkat dan mencatat satu kemajuan yang berhasil dicapai pada setiap pertemuan.",
    ],
  },
  {
    id: "tries-new-strategies",
    title: "Berani Mencoba Strategi Baru",
    group: "Ketangguhan",
    level: "positive",
    keywords: ["kreatif", "eksperimen", "alternatif", "strategi"],
    variants: [
      "{{firstname}} berani mencoba pendekatan baru ketika cara pertama belum berhasil. Sikap eksploratif ini membantu memperluas pemahamannya dan menunjukkan fleksibilitas dalam menyelesaikan masalah.",
      "Dalam mengerjakan tantangan, {{firstname}} tidak terpaku pada satu cara dan bersedia membandingkan beberapa strategi. Pertahankan keberanian bereksperimen sambil tetap menguji ketepatan setiap solusi.",
    ],
  },
  {
    id: "structured-explanation",
    title: "Penjelasan Perlu Lebih Terstruktur",
    group: "Komunikasi",
    level: "growth",
    keywords: ["sulit menjelaskan", "tidak runtut", "bingung menjelaskan", "komunikasi"],
    variants: [
      "{{firstname}} sudah mampu menemukan jawaban yang tepat, tetapi penjelasan prosesnya masih perlu disusun lebih runtut. Membiasakan diri menjelaskan tujuan, langkah, dan hasil secara berurutan akan membantu orang lain mengikuti pemikirannya.",
      "Pemahaman {{firstname}} mulai terlihat melalui hasil pekerjaannya. Agar lebih mudah dikomunikasikan, ia dapat mencatat tiga bagian utama—masalah, strategi, dan kesimpulan—sebelum menyampaikan jawabannya.",
    ],
  },
  {
    id: "clear-presentation",
    title: "Presentasi Jelas dan Terarah",
    group: "Komunikasi",
    level: "positive",
    keywords: ["presentasi bagus", "jelas", "percaya diri", "penyaji"],
    variants: [
      "{{firstname}} mampu mempresentasikan hasil pekerjaannya dengan jelas, terarah, dan sesuai tujuan. Ia juga dapat menanggapi pertanyaan dengan relevan. Pertahankan kemampuan ini dengan terus menggunakan contoh yang mendukung penjelasannya.",
      "Saat presentasi, {{firstname}} menyampaikan ide secara runtut dan membantu peserta lain memahami hasil yang dibuat. Penggunaan bahasa yang jelas dan fokus pada poin utama menjadi kekuatan yang patut dipertahankan.",
    ],
  },
  {
    id: "presentation-confidence",
    title: "Kepercayaan Diri Saat Presentasi Perlu Dilatih",
    group: "Komunikasi",
    level: "growth",
    keywords: ["malu presentasi", "gugup", "takut bicara", "public speaking"],
    variants: [
      "{{firstname}} sudah memahami materi yang akan disampaikan, tetapi masih terlihat ragu ketika mempresentasikan hasilnya. Berlatih dengan catatan poin utama dan memulai dari penjelasan singkat akan membantu meningkatkan kepercayaan dirinya.",
      "Isi presentasi {{firstname}} sudah cukup baik. Agar penyampaiannya semakin kuat, ia dapat berlatih menjelaskan satu bagian terlebih dahulu, menjaga tempo bicara, dan menggunakan hasil pekerjaannya sebagai panduan.",
    ],
  },
  {
    id: "active-listening",
    title: "Keterampilan Mendengarkan Perlu Dikuatkan",
    group: "Komunikasi",
    level: "growth",
    keywords: ["memotong pembicaraan", "tidak mendengarkan", "terburu menjawab", "menyimak"],
    variants: [
      "{{firstname}} antusias menyampaikan pendapat, tetapi masih perlu memberi waktu kepada orang lain untuk menyelesaikan penjelasannya. Mendengarkan hingga selesai lalu merangkum poin utama akan membantu menghasilkan respons yang lebih tepat.",
      "Keaktifan {{firstname}} dalam percakapan sudah baik. Langkah berikutnya adalah melatih kebiasaan menyimak, menunggu giliran, dan menanggapi isi pembicaraan sebelum menambahkan ide baru.",
    ],
  },
  {
    id: "specific-questions",
    title: "Mampu Mengajukan Pertanyaan yang Spesifik",
    group: "Komunikasi",
    level: "positive",
    keywords: ["bertanya dengan baik", "pertanyaan bagus", "kritis", "jelas"],
    variants: [
      "{{firstname}} mampu mengenali bagian yang belum dipahami dan mengajukan pertanyaan yang spesifik. Pertanyaan tersebut membantu proses diskusi menjadi lebih terarah dan menunjukkan bahwa ia memperhatikan proses belajarnya.",
      "Saat mengalami kesulitan, {{firstname}} dapat menjelaskan apa yang sudah dicoba dan bagian mana yang masih menjadi kendala. Cara bertanya seperti ini sangat baik untuk mempercepat pemahaman dan membangun kemandirian.",
    ],
  },
  {
    id: "creative-solution",
    title: "Menghasilkan Solusi yang Kreatif",
    group: "Kreativitas",
    level: "positive",
    keywords: ["unik", "kreatif", "ide baru", "solusi berbeda"],
    variants: [
      "{{firstname}} mampu menghasilkan solusi yang kreatif dan berbeda tanpa mengabaikan tujuan tugas. Ia juga dapat menjelaskan alasan pemilihan pendekatannya. Pertahankan keberanian mengeksplorasi ide sambil terus menguji ketepatan hasilnya.",
      "Dalam menyelesaikan tantangan, {{firstname}} menunjukkan kreativitas melalui pendekatan yang tidak langsung terpikirkan oleh banyak orang. Kemampuan melihat alternatif ini menjadi kekuatan yang baik untuk terus dikembangkan.",
    ],
  },
  {
    id: "extends-project",
    title: "Mengembangkan Proyek Melampaui Instruksi",
    group: "Kreativitas",
    level: "positive",
    keywords: ["fitur tambahan", "lebih dari tugas", "inisiatif", "pengembangan"],
    variants: [
      "{{firstname}} berhasil menyelesaikan kebutuhan utama proyek dan berinisiatif menambahkan pengembangan yang relevan. Hal ini menunjukkan rasa ingin tahu dan kemampuan menerapkan konsep secara lebih luas.",
      "Setelah memenuhi instruksi dasar, {{firstname}} mampu mengembangkan fitur tambahan yang membuat hasil proyek lebih bermakna. Pertahankan inisiatif ini dengan tetap memastikan fungsi utama selesai dan teruji terlebih dahulu.",
    ],
  },
  {
    id: "adapt-the-example",
    title: "Perlu Lebih Berani Mengembangkan Contoh",
    group: "Kreativitas",
    level: "growth",
    keywords: ["meniru contoh", "copy", "terpaku", "modifikasi"],
    variants: [
      "{{firstname}} sudah mampu mengikuti contoh dengan baik dan menghasilkan pekerjaan yang sesuai. Langkah berikutnya adalah mengubah satu bagian, mencoba data berbeda, atau menambahkan fitur sederhana agar pemahamannya tidak bergantung pada pola yang sama.",
      "Hasil kerja {{firstname}} menunjukkan bahwa ia dapat menerapkan contoh yang diberikan. Agar kreativitas dan pemahamannya berkembang, ia perlu mencoba memodifikasi contoh tersebut dan memperkirakan dampak setiap perubahan.",
    ],
  },
  {
    id: "ideas-to-execution",
    title: "Banyak Ide, Perlu Fokus pada Penyelesaian",
    group: "Kreativitas",
    level: "growth",
    keywords: ["terlalu banyak ide", "tidak selesai", "ganti ide", "sulit fokus"],
    variants: [
      "{{firstname}} memiliki banyak ide menarik dan antusias mengeksplorasinya. Agar idenya dapat menjadi hasil yang utuh, ia perlu memilih satu tujuan utama, menyelesaikan versi sederhana, lalu menambahkan pengembangan secara bertahap.",
      "Kreativitas {{firstname}} terlihat dari banyaknya kemungkinan yang ingin dicoba. Membuat daftar prioritas dan menunda ide tambahan sampai fungsi utama selesai akan membantu menjaga fokus tanpa kehilangan gagasan baiknya.",
    ],
  },
  {
    id: "curious-explorer",
    title: "Rasa Ingin Tahu dan Eksplorasi Tinggi",
    group: "Kreativitas",
    level: "positive",
    keywords: ["penasaran", "eksplorasi", "suka mencoba", "ingin tahu"],
    variants: [
      "{{firstname}} menunjukkan rasa ingin tahu yang tinggi dengan mencoba fitur, mengajukan kemungkinan baru, dan mencari tahu cara kerja suatu konsep. Sikap eksploratif ini sangat mendukung pembelajaran yang lebih mendalam.",
      "Selama pembelajaran, {{firstname}} tidak hanya mengikuti instruksi tetapi juga aktif mengeksplorasi pertanyaan lanjutan. Pertahankan rasa ingin tahu ini sambil mencatat hasil percobaan agar pengetahuannya semakin terstruktur.",
    ],
  },
  {
    id: "plans-milestones",
    title: "Mampu Merencanakan Tahapan Proyek",
    group: "Manajemen Proyek",
    level: "positive",
    keywords: ["rencana", "milestone", "target", "terorganisasi"],
    variants: [
      "{{firstname}} mampu membagi proyek menjadi tahapan yang jelas dan menyelesaikannya sesuai prioritas. Perencanaan ini membantu progresnya terpantau dan mengurangi kesulitan ketika proyek mulai berkembang.",
      "Sebelum mengerjakan, {{firstname}} dapat menentukan tujuan, urutan pekerjaan, dan hasil yang ingin dicapai. Kebiasaan merencanakan seperti ini sangat baik untuk mempertahankan kualitas dan ketepatan waktu.",
    ],
  },
  {
    id: "procrastination-pattern",
    title: "Perlu Mengurangi Kebiasaan Menunda",
    group: "Manajemen Proyek",
    level: "attention",
    keywords: ["menunda", "mepet deadline", "prokrastinasi", "terlambat mulai"],
    variants: [
      "{{firstname}} memiliki kemampuan untuk menyelesaikan tugas, tetapi proses pengerjaannya sering dimulai mendekati tenggat. Menetapkan target kecil sejak awal dan mencatat progres setiap sesi akan membantu mengurangi tekanan di akhir.",
      "Hasil kerja {{firstname}} dapat berkembang lebih baik apabila pengerjaan dimulai lebih awal. Membagi tugas menjadi beberapa bagian singkat dengan tenggat pribadi akan membantu menjaga konsistensi dan memberi waktu untuk melakukan perbaikan.",
    ],
  },
  {
    id: "starts-needs-finishing",
    title: "Memulai dengan Baik, Perlu Menuntaskan",
    group: "Manajemen Proyek",
    level: "growth",
    keywords: ["tidak selesai", "setengah jadi", "banyak mulai", "belum tuntas"],
    variants: [
      "{{firstname}} dapat memulai tugas dengan antusias dan menghasilkan bagian awal yang baik, tetapi masih perlu meningkatkan konsistensi hingga pekerjaan selesai. Menentukan definisi selesai dan memeriksa progres pada setiap tahap akan membantu penuntasan tugas.",
      "Ide awal dan proses persiapan {{firstname}} sudah cukup baik. Agar hasilnya dapat dinilai secara utuh, ia perlu memprioritaskan penyelesaian fungsi utama sebelum berpindah ke tugas atau ide berikutnya.",
    ],
  },
  {
    id: "quality-late-delivery",
    title: "Hasil Baik, Ketepatan Waktu Perlu Ditingkatkan",
    group: "Manajemen Proyek",
    level: "growth",
    keywords: ["bagus tapi terlambat", "telat mengumpulkan", "deadline", "hasil baik"],
    variants: [
      "{{firstname}} mampu menghasilkan pekerjaan dengan kualitas yang baik, tetapi pengumpulannya belum selalu tepat waktu. Menentukan batas waktu untuk pengerjaan utama dan menyisakan waktu khusus untuk revisi akan membantu menjaga kualitas sekaligus kedisiplinan.",
      "Kualitas tugas {{firstname}} menunjukkan pemahaman dan usaha yang baik. Langkah pengembangan berikutnya adalah mengatur waktu agar pekerjaan dapat selesai sesuai jadwal tanpa mengurangi ketelitiannya.",
    ],
  },
  {
    id: "fast-needs-testing",
    title: "Cepat Menyelesaikan, Perlu Pengujian Lebih Baik",
    group: "Manajemen Proyek",
    level: "growth",
    keywords: ["cepat selesai", "tidak dites", "bug", "cek ulang"],
    variants: [
      "{{firstname}} mampu menyelesaikan tugas dengan cepat dan memahami alur utama dengan baik. Sebelum mengumpulkan, ia perlu menguji beberapa kondisi berbeda dan mencatat apakah seluruh kebutuhan sudah terpenuhi.",
      "Kecepatan kerja {{firstname}} menjadi kekuatan yang positif. Agar hasilnya semakin andal, waktu yang tersisa dapat digunakan untuk memeriksa kembali instruksi, mencoba data uji lain, dan memperbaiki bagian yang belum konsisten.",
    ],
  },
  {
    id: "recognizes-learning-gaps",
    title: "Mampu Mengenali Kebutuhan Belajarnya",
    group: "Strategi Belajar",
    level: "positive",
    keywords: ["refleksi", "sadar kekurangan", "tahu belum paham", "evaluasi diri"],
    variants: [
      "{{firstname}} mampu mengenali konsep yang sudah dikuasai dan bagian yang masih perlu dipelajari. Kesadaran ini membantunya memilih latihan dan pertanyaan yang sesuai dengan kebutuhan belajarnya.",
      "Saat melakukan refleksi, {{firstname}} dapat menjelaskan kesulitan yang dialami dan menentukan langkah berikutnya. Kemampuan mengevaluasi proses belajar sendiri ini patut dipertahankan.",
    ],
  },
  {
    id: "effective-notes",
    title: "Memiliki Catatan Belajar yang Efektif",
    group: "Strategi Belajar",
    level: "positive",
    keywords: ["catatan", "rangkuman", "dokumentasi", "terorganisasi"],
    variants: [
      "{{firstname}} membuat catatan yang ringkas dan terstruktur sehingga dapat digunakan kembali saat mengerjakan latihan. Kebiasaan ini membantu memperkuat ingatan sekaligus mendukung proses belajar mandiri.",
      "Catatan belajar {{firstname}} sudah memuat konsep utama, contoh, dan bagian yang perlu diperhatikan. Pertahankan kebiasaan ini dengan menambahkan refleksi singkat setelah menyelesaikan latihan.",
    ],
  },
  {
    id: "read-instructions-carefully",
    title: "Perlu Membaca Instruksi Lebih Cermat",
    group: "Strategi Belajar",
    level: "growth",
    keywords: ["tidak baca soal", "salah instruksi", "melewatkan perintah", "terburu-buru"],
    variants: [
      "{{firstname}} sudah memiliki kemampuan untuk mengerjakan tugas, tetapi beberapa bagian instruksi masih terlewat. Menandai kata kunci dan membuat daftar kebutuhan sebelum mulai akan membantu menghasilkan jawaban yang lebih lengkap.",
      "Proses pengerjaan {{firstname}} berjalan cukup baik setelah tujuan tugas dipahami. Agar tidak perlu banyak mengulang, ia dapat membiasakan diri membaca instruksi sampai selesai dan memeriksa setiap persyaratan sebelum mengumpulkan.",
    ],
  },
  {
    id: "repeated-mistakes",
    title: "Perlu Strategi untuk Mengurangi Kesalahan Berulang",
    group: "Strategi Belajar",
    level: "growth",
    keywords: ["kesalahan sama", "lupa", "mengulang kesalahan", "tidak belajar dari revisi"],
    variants: [
      "{{firstname}} sudah bersedia memperbaiki pekerjaannya, tetapi beberapa kesalahan yang sama masih muncul. Membuat daftar kesalahan, penyebab, dan cara memperbaikinya akan membantu mengenali pola dan mencegah pengulangan.",
      "Pemahaman {{firstname}} terus berkembang, meskipun beberapa bagian masih perlu dikoreksi berulang kali. Meninjau catatan revisi sebelum memulai tugas berikutnya dapat membantu menerapkan pembelajaran sebelumnya.",
    ],
  },
  {
    id: "learning-routine",
    title: "Rutinitas Latihan Perlu Dibangun",
    group: "Strategi Belajar",
    level: "growth",
    keywords: ["jarang latihan", "tidak rutin", "belajar hanya di kelas", "konsistensi"],
    variants: [
      "{{firstname}} dapat mengikuti materi saat kelas, tetapi pemahamannya perlu diperkuat melalui latihan yang lebih teratur. Latihan singkat dengan jadwal konsisten akan lebih efektif daripada mengerjakan banyak latihan sekaligus menjelang evaluasi.",
      "Potensi {{firstname}} akan berkembang lebih optimal dengan rutinitas belajar yang sederhana dan realistis. Menentukan satu target kecil di antara pertemuan dapat membantu menjaga pemahaman dan membangun kebiasaan belajar mandiri.",
    ],
  },
  {
    id: "strong-programming-logic",
    title: "Logika Pemrograman Sudah Kuat",
    group: "Keterampilan Teknis",
    level: "positive",
    keywords: ["algoritma", "logika", "alur", "problem solving"],
    variants: [
      "{{firstname}} mampu memahami masalah dan menyusun alur penyelesaian secara logis sebelum mulai menulis kode. Kemampuan ini membantunya menghasilkan solusi yang terarah dan lebih mudah diperiksa.",
      "Logika pemrograman {{firstname}} sudah berkembang dengan baik. Ia dapat memecah masalah menjadi langkah-langkah kecil dan memilih struktur penyelesaian yang sesuai. Pertahankan kebiasaan merencanakan alur sebelum mengerjakan.",
    ],
  },
  {
    id: "syntax-needs-practice",
    title: "Logika Baik, Sintaks Perlu Dilatih",
    group: "Keterampilan Teknis",
    level: "growth",
    keywords: ["sintaks", "syntax", "typo", "error penulisan"],
    variants: [
      "{{firstname}} sudah memahami logika penyelesaian, tetapi masih menemui beberapa kendala pada penulisan sintaks. Latihan singkat dan kebiasaan membaca pesan error akan membantu meningkatkan ketepatan penulisan kode.",
      "Alur berpikir {{firstname}} sudah cukup baik. Agar implementasinya lebih lancar, ia perlu memperkuat penguasaan sintaks dasar dan memeriksa tanda baca, penamaan, serta struktur kode secara bertahap.",
    ],
  },
  {
    id: "independent-debugging",
    title: "Mampu Melakukan Debugging Mandiri",
    group: "Keterampilan Teknis",
    level: "positive",
    keywords: ["debug", "error", "bug", "memperbaiki kode"],
    variants: [
      "{{firstname}} mampu menelusuri penyebab error dengan membaca pesan yang muncul, memeriksa bagian terkait, dan menguji perbaikan secara mandiri. Strategi debugging ini merupakan perkembangan yang sangat positif.",
      "Saat program belum berjalan sesuai harapan, {{firstname}} dapat tetap tenang dan melakukan pengujian langkah demi langkah. Kemampuannya menemukan serta memperbaiki masalah semakin baik dan perlu terus dipertahankan.",
    ],
  },
  {
    id: "code-readability",
    title: "Kerapian dan Keterbacaan Kode Perlu Ditingkatkan",
    group: "Keterampilan Teknis",
    level: "growth",
    keywords: ["kode berantakan", "clean code", "penamaan", "indentasi"],
    variants: [
      "Kode yang dibuat {{firstname}} sudah dapat menjalankan fungsi utama. Selanjutnya, ia perlu memperhatikan indentasi, penamaan yang jelas, dan pembagian kode agar hasilnya lebih mudah dibaca serta dikembangkan.",
      "{{firstname}} sudah mampu menghasilkan solusi yang bekerja dengan baik. Membiasakan diri merapikan struktur dan menggunakan nama yang menggambarkan fungsi setiap bagian akan meningkatkan kualitas kodenya.",
    ],
  },
  {
    id: "technical-testing",
    title: "Kemampuan Pengujian Perlu Dikembangkan",
    group: "Keterampilan Teknis",
    level: "growth",
    keywords: ["testing", "uji coba", "bug", "kasus berbeda"],
    variants: [
      "{{firstname}} sudah berhasil membuat fungsi utama berjalan, tetapi pengujiannya masih terbatas pada satu kondisi. Mencoba beberapa masukan, termasuk kondisi tidak biasa, akan membantu memastikan hasilnya lebih andal.",
      "Pengerjaan teknis {{firstname}} sudah berada di arah yang baik. Langkah berikutnya adalah membuat daftar skenario pengujian dan mencatat hasilnya agar masalah dapat ditemukan sebelum tugas dikumpulkan.",
    ],
  },
  {
    id: "class-to-assessment",
    title: "Pemahaman Kelas Perlu Diterapkan Saat Evaluasi",
    group: "Evaluasi",
    level: "growth",
    keywords: ["kuis", "ujian", "latihan bisa", "nilai"],
    variants: [
      "{{firstname}} mampu mengikuti latihan selama kelas, tetapi masih kesulitan menerapkan pemahamannya secara mandiri saat evaluasi. Latihan dengan batas waktu dan bentuk soal yang bervariasi akan membantu meningkatkan kesiapan.",
      "Pemahaman {{firstname}} terlihat baik ketika berdiskusi bersama. Agar hasil evaluasinya lebih mencerminkan kemampuan tersebut, ia perlu lebih sering berlatih menyelesaikan soal tanpa petunjuk bertahap.",
    ],
  },
  {
    id: "improving-assessment-results",
    title: "Hasil Evaluasi Terus Meningkat",
    group: "Evaluasi",
    level: "positive",
    keywords: ["nilai naik", "hasil meningkat", "kuis", "progres"],
    variants: [
      "Hasil evaluasi {{firstname}} menunjukkan peningkatan yang konsisten. Ia semakin mampu menerapkan konsep dengan tepat dan memperbaiki kesalahan dari evaluasi sebelumnya. Pertahankan pola belajar yang sudah berjalan baik ini.",
      "{{firstname}} memperlihatkan perkembangan positif melalui hasil evaluasi yang semakin baik. Usaha meninjau kembali materi dan belajar dari koreksi mulai memberikan hasil yang nyata.",
    ],
  },
  {
    id: "assessment-time-management",
    title: "Pengelolaan Waktu Evaluasi Perlu Dilatih",
    group: "Evaluasi",
    level: "growth",
    keywords: ["kehabisan waktu", "ujian", "kuis", "terlalu lama"],
    variants: [
      "{{firstname}} sudah memahami sebagian besar materi, tetapi belum dapat menyelesaikan seluruh bagian dalam waktu yang tersedia. Membagi waktu berdasarkan jumlah dan tingkat kesulitan soal akan membantu pengerjaan menjadi lebih terarah.",
      "Beberapa jawaban {{firstname}} sudah tepat, namun waktu evaluasi belum digunakan secara seimbang. Ia dapat memulai dari soal yang paling dipahami, memberi batas waktu, lalu kembali ke bagian yang lebih menantang.",
    ],
  },
  {
    id: "complete-assessment-answers",
    title: "Jawaban Evaluasi Perlu Lebih Lengkap",
    group: "Evaluasi",
    level: "growth",
    keywords: ["jawaban singkat", "tidak lengkap", "kurang penjelasan", "nilai"],
    variants: [
      "{{firstname}} sudah menemukan inti jawaban yang tepat, tetapi penjelasannya belum selalu lengkap. Menuliskan langkah, alasan, dan kesimpulan akan membantu menunjukkan pemahaman secara lebih utuh.",
      "Pemahaman dasar {{firstname}} sudah terlihat dalam hasil evaluasi. Agar jawabannya memperoleh hasil yang lebih baik, ia perlu memastikan setiap bagian pertanyaan sudah dijawab dan didukung penjelasan yang relevan.",
    ],
  },
  {
    id: "strong-assessment-revision",
    title: "Perbaikan Hasil Evaluasi Sangat Baik",
    group: "Evaluasi",
    level: "positive",
    keywords: ["remedial", "revisi", "perbaikan nilai", "koreksi"],
    variants: [
      "{{firstname}} memanfaatkan hasil evaluasi sebagai bahan belajar dan mampu memperbaiki bagian yang sebelumnya belum tepat. Revisi yang dilakukan menunjukkan pemahaman yang lebih kuat dan sikap belajar yang positif.",
      "Setelah menerima koreksi, {{firstname}} dapat meninjau kembali jawabannya dan menghasilkan perbaikan yang lebih baik. Kemampuan menggunakan umpan balik ini sangat mendukung perkembangan belajarnya.",
    ],
  },
  {
    id: "punctual-and-prepared",
    title: "Hadir Tepat Waktu dan Siap Belajar",
    group: "Kesiapan Belajar",
    level: "positive",
    keywords: ["tepat waktu", "siap", "disiplin", "perlengkapan"],
    variants: [
      "{{firstname}} hadir tepat waktu dan sudah menyiapkan kebutuhan belajar sebelum kelas dimulai. Kesiapan ini membantunya mengikuti materi dengan lebih fokus dan memanfaatkan waktu pembelajaran secara efektif.",
      "Kedisiplinan {{firstname}} terlihat dari kebiasaannya hadir tepat waktu serta siap mengikuti kegiatan sejak awal. Sikap ini memberikan dasar yang baik untuk proses belajar yang konsisten.",
    ],
  },
  {
    id: "reviews-previous-material",
    title: "Mengingat dan Menghubungkan Materi Sebelumnya",
    group: "Kesiapan Belajar",
    level: "positive",
    keywords: ["review", "mengulang", "materi sebelumnya", "ingat"],
    variants: [
      "{{firstname}} mampu mengingat materi sebelumnya dan menghubungkannya dengan konsep baru. Kebiasaan meninjau kembali pembelajaran membantu pemahamannya berkembang secara berkesinambungan.",
      "Saat memulai topik baru, {{firstname}} dapat menggunakan pengetahuan dari pertemuan sebelumnya sebagai dasar. Pertahankan kebiasaan mengulang materi agar hubungan antar-konsep semakin kuat.",
    ],
  },
  {
    id: "slow-task-start",
    title: "Perlu Lebih Sigap Memulai Tugas",
    group: "Kesiapan Belajar",
    level: "growth",
    keywords: ["lama mulai", "menunggu", "belum siap", "perlu diingatkan"],
    variants: [
      "{{firstname}} dapat mengikuti tugas setelah mendapat arahan, tetapi masih memerlukan waktu cukup lama untuk memulai. Menyiapkan perlengkapan dan menentukan langkah pertama sejak awal akan membantu menggunakan waktu dengan lebih efektif.",
      "Setelah mulai mengerjakan, {{firstname}} mampu mengikuti proses dengan cukup baik. Agar progresnya lebih maksimal, ia perlu membangun kebiasaan membaca instruksi dan langsung mengerjakan bagian pertama tanpa menunggu banyak pengingat.",
    ],
  },
  {
    id: "prepare-device-before-class",
    title: "Persiapan Perangkat Sebelum Kelas Perlu Ditingkatkan",
    group: "Kesiapan Belajar",
    level: "technical",
    keywords: ["baterai", "aplikasi", "login", "perangkat belum siap"],
    variants: [
      "{{firstname}} sudah berusaha mengikuti kelas, tetapi beberapa kali waktu belajar terpakai untuk menyiapkan perangkat atau aplikasi. Memeriksa daya, koneksi, akun, dan aplikasi sebelum kelas akan membantu pembelajaran dimulai lebih lancar.",
      "Proses belajar {{firstname}} akan lebih optimal apabila perangkat sudah siap digunakan sejak awal. Checklist persiapan sederhana sebelum kelas dapat mengurangi kendala masuk akun, pembaruan aplikasi, atau berkas yang belum tersedia.",
    ],
  },
  {
    id: "previews-upcoming-material",
    title: "Aktif Mempersiapkan Materi Berikutnya",
    group: "Kesiapan Belajar",
    level: "positive",
    keywords: ["belajar duluan", "preview", "persiapan materi", "inisiatif"],
    variants: [
      "{{firstname}} menunjukkan inisiatif dengan membaca atau mencoba materi sebelum dibahas di kelas. Persiapan ini membuatnya lebih siap bertanya dan memahami pembahasan secara mendalam.",
      "Sebelum pertemuan, {{firstname}} sudah mengenali topik yang akan dipelajari dan mencatat beberapa pertanyaan awal. Kebiasaan mempersiapkan materi seperti ini sangat baik untuk mendukung pembelajaran aktif.",
    ],
  },
  {
    id: "steady-learning-journey",
    title: "Perkembangan Stabil dan Berkelanjutan",
    group: "Perjalanan Belajar",
    level: "positive",
    keywords: ["stabil", "bertahap", "konsisten", "perkembangan"],
    variants: [
      "{{firstname}} menunjukkan perkembangan yang stabil dari satu pertemuan ke pertemuan berikutnya. Konsistensi dalam hadir, berlatih, dan menanggapi masukan menjadi kekuatan utama dalam proses belajarnya.",
      "Progres {{firstname}} berlangsung secara bertahap tetapi terus bergerak maju. Pertahankan kebiasaan belajar yang sudah terbentuk agar pemahamannya semakin matang dan tahan lama.",
    ],
  },
  {
    id: "learning-plateau",
    title: "Perkembangan Mulai Mendatar",
    group: "Perjalanan Belajar",
    level: "growth",
    keywords: ["stagnan", "plateau", "tidak berkembang", "jalan di tempat"],
    variants: [
      "{{firstname}} sudah memiliki dasar yang cukup baik, tetapi perkembangan dalam beberapa pertemuan terakhir belum terlihat signifikan. Variasi latihan dan target baru yang lebih spesifik dapat membantu mendorong progres berikutnya.",
      "Kemampuan {{firstname}} saat ini cukup stabil, namun ia perlu tantangan atau strategi belajar yang berbeda agar kembali berkembang. Menentukan satu keterampilan yang ingin ditingkatkan akan membantu memberi arah yang lebih jelas.",
    ],
  },
  {
    id: "catching-up-material",
    title: "Berusaha Mengejar Materi yang Tertinggal",
    group: "Perjalanan Belajar",
    level: "positive",
    keywords: ["mengejar", "tertinggal", "susulan", "catch up"],
    variants: [
      "{{firstname}} menunjukkan usaha yang baik untuk mengejar materi yang sempat tertinggal. Ia bersedia meninjau kembali pembahasan dan menyelesaikan latihan susulan. Pertahankan progres ini secara bertahap agar beban belajar tetap terkelola.",
      "Meskipun sempat tertinggal, {{firstname}} mulai menunjukkan pemahaman yang lebih baik setelah melakukan pengulangan. Menentukan urutan materi prioritas akan membantunya kembali mengikuti ritme kelas.",
    ],
  },
  {
    id: "returning-engagement",
    title: "Kembali Aktif Setelah Mengalami Hambatan",
    group: "Perjalanan Belajar",
    level: "positive",
    keywords: ["kembali aktif", "sempat absen", "bangkit", "mulai semangat"],
    variants: [
      "{{firstname}} kembali menunjukkan keterlibatan yang baik setelah sebelumnya mengalami hambatan dalam proses belajar. Keberaniannya untuk kembali mencoba dan mengikuti kegiatan patut diapresiasi.",
      "Dalam beberapa pertemuan terakhir, {{firstname}} mulai kembali aktif dan berusaha memperbaiki ketertinggalannya. Dukungan serta target kecil yang konsisten akan membantu menjaga momentum positif ini.",
    ],
  },
  {
    id: "concept-breakthrough",
    title: "Berhasil Menembus Materi yang Menantang",
    group: "Perjalanan Belajar",
    level: "milestone",
    keywords: ["akhirnya paham", "terobosan", "materi sulit", "berhasil"],
    variants: [
      "{{firstname}} berhasil memahami konsep yang sebelumnya terasa menantang. Pencapaian ini menunjukkan bahwa latihan, keberanian bertanya, dan ketekunannya memberikan hasil yang nyata.",
      "Setelah melalui beberapa kali percobaan, {{firstname}} kini mampu menerapkan materi yang sebelumnya masih sulit. Jadikan keberhasilan ini sebagai pengingat bahwa proses bertahap dapat menghasilkan kemajuan besar.",
    ],
  },
  {
    id: "first-completed-project",
    title: "Berhasil Menyelesaikan Proyek Pertama",
    group: "Pencapaian",
    level: "milestone",
    keywords: ["proyek pertama", "selesai", "milestone", "pencapaian"],
    variants: [
      "Selamat, {{firstname}} berhasil menyelesaikan proyek pertamanya! Pencapaian ini menunjukkan keberanian mencoba, ketekunan menghadapi kesulitan, dan kemampuan menerapkan materi menjadi hasil yang nyata.",
      "{{firstname}} telah menuntaskan proyek pertama dengan baik. Dari perencanaan hingga hasil akhir, ia menunjukkan proses belajar yang positif. Semoga pengalaman ini menjadi dasar untuk mencoba proyek berikutnya.",
    ],
  },
  {
    id: "first-independent-task",
    title: "Pertama Kali Menyelesaikan Tugas Secara Mandiri",
    group: "Pencapaian",
    level: "milestone",
    keywords: ["pertama mandiri", "tanpa bantuan", "tugas sendiri", "pencapaian"],
    variants: [
      "{{firstname}} berhasil menyelesaikan tugas secara mandiri dengan arahan yang minimal. Pencapaian ini menunjukkan bahwa pemahaman dan kepercayaan dirinya mulai berkembang dengan baik.",
      "Untuk pertama kalinya, {{firstname}} mampu merencanakan dan menuntaskan latihan tanpa bergantung pada petunjuk bertahap. Pertahankan kemandirian ini sambil tetap melakukan pemeriksaan ulang.",
    ],
  },
  {
    id: "first-presentation",
    title: "Berani Melakukan Presentasi Pertama",
    group: "Pencapaian",
    level: "milestone",
    keywords: ["presentasi pertama", "berani bicara", "tampil", "percaya diri"],
    variants: [
      "{{firstname}} berhasil melakukan presentasi pertamanya dan menyampaikan hasil pekerjaan kepada kelas. Keberanian mengambil langkah ini patut diapresiasi dan menjadi awal yang baik untuk membangun kepercayaan diri.",
      "Meskipun masih terlihat sedikit ragu, {{firstname}} berani tampil dan menjelaskan pekerjaannya untuk pertama kali. Pencapaian ini menunjukkan kemauan untuk berkembang dan keluar dari zona nyaman.",
    ],
  },
  {
    id: "improved-task-submission",
    title: "Konsistensi Pengumpulan Tugas Meningkat",
    group: "Pencapaian",
    level: "positive",
    keywords: ["mulai rajin", "tepat waktu", "tugas lengkap", "membaik"],
    variants: [
      "{{firstname}} menunjukkan peningkatan dalam menyelesaikan dan mengumpulkan tugas tepat waktu. Perubahan kebiasaan ini membantu progres belajarnya menjadi lebih teratur dan mudah dipantau.",
      "Dalam beberapa tugas terakhir, {{firstname}} semakin konsisten memenuhi tenggat dan melengkapi pekerjaannya. Pertahankan kebiasaan baik ini agar perkembangannya terus stabil.",
    ],
  },
  {
    id: "mastered-difficult-topic",
    title: "Berhasil Menguasai Topik yang Sulit",
    group: "Pencapaian",
    level: "milestone",
    keywords: ["menguasai", "materi sulit", "berhasil paham", "pencapaian"],
    variants: [
      "{{firstname}} kini mampu memahami dan menerapkan topik yang sebelumnya masih menjadi kendala. Pencapaian ini merupakan hasil dari usaha, latihan, dan kesediaannya untuk terus memperbaiki pemahaman.",
      "Kemajuan {{firstname}} pada materi yang menantang terlihat sangat baik. Ia tidak hanya berhasil menyelesaikan latihan, tetapi juga mulai mampu menjelaskan konsep tersebut dengan lebih percaya diri.",
    ],
  },
  {
    id: "responsible-references",
    title: "Menggunakan Referensi secara Bertanggung Jawab",
    group: "Literasi Digital",
    level: "positive",
    keywords: ["referensi", "sumber", "internet", "dokumentasi"],
    variants: [
      "{{firstname}} mampu menggunakan referensi untuk mendukung proses belajar tanpa sekadar menyalin hasil. Ia membandingkan informasi, memilih bagian yang relevan, dan menyesuaikannya dengan kebutuhan tugas.",
      "Saat mencari bantuan dari internet atau dokumentasi, {{firstname}} tetap berusaha memahami dan menerapkan informasi dengan caranya sendiri. Kebiasaan ini menunjukkan literasi digital yang baik.",
    ],
  },
  {
    id: "explains-ai-assisted-work",
    title: "Mampu Menjelaskan Hasil dari Alat Bantu AI",
    group: "Literasi Digital",
    level: "positive",
    keywords: ["AI", "ChatGPT", "alat bantu", "menjelaskan kode"],
    variants: [
      "{{firstname}} menggunakan alat bantu AI secara terarah dan tetap mampu menjelaskan hasil yang digunakan. Ia juga memeriksa kesesuaian jawaban dengan tujuan tugas, sehingga alat bantu berfungsi sebagai pendukung proses belajar.",
      "Dalam menggunakan AI, {{firstname}} tidak langsung menerima hasil begitu saja. Ia meninjau, mencoba, dan menyesuaikan jawaban sebelum menerapkannya. Sikap kritis ini perlu terus dipertahankan.",
    ],
  },
  {
    id: "overreliance-on-tools",
    title: "Kemandirian Saat Menggunakan Alat Bantu Perlu Dikuatkan",
    group: "Literasi Digital",
    level: "growth",
    keywords: ["bergantung AI", "copy paste", "tidak paham kode", "ChatGPT"],
    variants: [
      "Hasil pekerjaan {{firstname}} sudah cukup lengkap, tetapi beberapa bagian masih perlu dijelaskan kembali untuk memastikan konsepnya benar-benar dipahami. Saat menggunakan alat bantu, ia perlu meninjau dan menguji setiap bagian sebelum diterapkan.",
      "{{firstname}} sudah mengenal cara menggunakan referensi dan alat bantu digital. Langkah berikutnya adalah mencoba menyusun solusi awal secara mandiri, lalu menggunakan alat bantu untuk memeriksa atau mengembangkan hasilnya.",
    ],
  },
  {
    id: "source-attribution",
    title: "Pencantuman Sumber Perlu Dibiasakan",
    group: "Literasi Digital",
    level: "growth",
    keywords: ["sitasi", "sumber", "kredit", "referensi"],
    variants: [
      "{{firstname}} sudah mampu menemukan referensi yang membantu pengerjaan tugas. Selanjutnya, ia perlu membiasakan diri mencatat dan mencantumkan sumber agar proses kerjanya lebih transparan dan dapat ditelusuri.",
      "Informasi yang digunakan {{firstname}} sudah relevan dengan tugas. Menambahkan nama sumber atau tautan referensi akan membantu membedakan hasil pemikiran sendiri dari materi pendukung yang digunakan.",
    ],
  },
  {
    id: "digital-class-etiquette",
    title: "Etika Berkomunikasi Digital Perlu Diperkuat",
    group: "Literasi Digital",
    level: "growth",
    keywords: ["chat", "spam", "sopan", "etika online"],
    variants: [
      "{{firstname}} cukup aktif menggunakan media komunikasi kelas. Agar interaksi tetap nyaman dan efektif, ia perlu memastikan pesan sesuai topik, menggunakan bahasa yang sopan, dan memberi waktu kepada orang lain untuk merespons.",
      "Partisipasi digital {{firstname}} sudah terlihat, tetapi cara menyampaikan pesan masih perlu disesuaikan dengan konteks kelas. Membaca kembali pesan sebelum mengirim akan membantu menjaga kejelasan dan sikap saling menghargai.",
    ],
  },
  {
    id: "device",
    title: "Kendala Device / Teknis",
    group: "Kendala Teknis",
    level: "technical",
    variants: [
      "{{firstname}} mengikuti kelas dengan baik, namun beberapa kali mengalami kendala teknis pada perangkat atau koneksi yang sedikit menghambat proses belajar. Semoga ke depannya kendala tersebut bisa diminimalisir agar pembelajaran berjalan lebih optimal.",
    ],
  },
  {
    id: "internet",
    title: "Kendala Koneksi Internet",
    group: "Kendala Teknis",
    level: "technical",
    variants: [
      "{{firstname}} menunjukkan semangat belajar yang baik, namun terkadang mengalami gangguan koneksi internet saat kelas berlangsung. Diharapkan ke depannya koneksi bisa lebih stabil agar tidak tertinggal materi penting.",
    ],
  },
  {
    id: "device-performance",
    title: "Pembelajaran Terdampak Kendala Perangkat",
    group: "Kendala Teknis",
    level: "technical",
    variants: [
      "Selama pembelajaran, {{firstname}} beberapa kali mengalami kendala pada perangkat yang digunakan sehingga sedikit memperlambat pengerjaan tugas. Semoga ke depannya perangkat dapat lebih optimal agar proses belajar lebih lancar.",
    ],
  },
  {
    id: "technical-effort",
    title: "Tetap Berusaha Meski Ada Kendala",
    group: "Kendala Teknis",
    level: "positive",
    variants: [
      "Meskipun sempat mengalami kendala teknis pada perangkat, {{firstname}} tetap berusaha mengikuti pembelajaran dengan baik. Sikap ini sangat positif. Semoga ke depan proses belajar bisa berjalan lebih lancar.",
    ],
  },
  {
    id: "technical-support",
    title: "Perlu Dukungan Teknis Tambahan",
    group: "Kendala Teknis",
    level: "technical",
    variants: [
      "{{firstname}} cukup baik dalam mengikuti kelas, namun masih sering terkendala perangkat atau sistem yang digunakan. Diharapkan ada penyesuaian atau dukungan teknis agar proses belajarnya lebih maksimal dan tidak terhambat.",
    ],
  },
  {
    id: "new-adapting",
    title: "Murid Baru — Masa Adaptasi",
    group: "Murid Baru",
    level: "growth",
    variants: [
      "{{firstname}} merupakan murid baru yang masih dalam tahap adaptasi dengan suasana kelas dan sistem pembelajaran. Sejauh ini sudah menunjukkan sikap belajar yang baik. Semoga semakin nyaman dan percaya diri dalam mengikuti kelas.",
      "Sebagai murid baru, {{firstname}} sudah mulai menyesuaikan diri dengan baik. Ia fokus saat materi dijelaskan dan berusaha mengikuti instruksi yang diberikan. Semoga ke depannya semakin aktif dan percaya diri.",
    ],
  },
  {
    id: "new-fast",
    title: "Murid Baru & Cepat Beradaptasi",
    group: "Murid Baru",
    level: "positive",
    variants: [
      "Meskipun baru bergabung, {{firstname}} mampu beradaptasi dengan cepat. Ia cukup fokus dan menunjukkan pemahaman yang baik terhadap materi. Semoga semangat belajarnya terus terjaga.",
    ],
  },
  {
    id: "new-shy",
    title: "Murid Baru & Masih Malu",
    group: "Murid Baru",
    level: "growth",
    variants: [
      "{{firstname}} merupakan murid baru yang masih terlihat malu-malu saat kelas berlangsung. Namun, ia sudah berusaha mengikuti pembelajaran dengan baik. Semoga ke depannya semakin percaya diri untuk bertanya dan berdiskusi.",
      "{{firstname}} masih dalam tahap adaptasi sehingga belum banyak berpartisipasi saat kelas. Dengan waktu dan dukungan yang konsisten, diharapkan ia bisa lebih percaya diri dan nyaman untuk aktif berdiskusi.",
    ],
  },
  {
    id: "new-potential",
    title: "Murid Baru dengan Potensi Baik",
    group: "Murid Baru",
    level: "positive",
    variants: [
      "Sebagai murid baru, {{firstname}} menunjukkan potensi yang baik dalam memahami materi. Dengan konsistensi dan latihan rutin, perkembangannya diprediksi akan semakin optimal ke depannya.",
    ],
  },
  {
    id: "graduated",
    title: "Sudah Lulus / Menyelesaikan Program",
    group: "Kelulusan",
    level: "milestone",
    variants: [
      "Selamat, {{firstname}} telah menyelesaikan program dengan baik. Selama mengikuti kelas, {{firstname}} menunjukkan sikap belajar yang positif dan perkembangan yang konsisten. Semoga ilmu yang didapat bisa terus dikembangkan ke level berikutnya. Sukses selalu ya!",
      "{{firstname}} telah menyelesaikan program pembelajaran dengan perkembangan yang baik. Terlihat adanya peningkatan pemahaman dan kemandirian dalam mengerjakan tugas. Semoga semangat belajarnya terus terjaga untuk tantangan berikutnya.",
      "Selamat, {{firstname}}, atas pencapaiannya menyelesaikan program ini dengan sangat baik 🌟 Keaktifan, tanggung jawab, dan pemahaman materinya sangat terlihat selama kelas berlangsung. Semoga terus berkembang dan semakin percaya diri ke depannya.",
      "Terima kasih atas kerja keras {{firstname}} selama mengikuti kelas ini. Perkembangan dan usaha yang ditunjukkan sudah baik. Semoga pengalaman belajar ini menjadi bekal yang baik untuk perjalanan belajar selanjutnya.",
    ],
  },
  {
    id: "general-suggestion",
    title: "Saran Umum Pengembangan",
    group: "Saran",
    level: "growth",
    variants: [
      "Ke depannya, diharapkan {{firstname}} dapat lebih konsisten berlatih di luar jam kelas agar pemahamannya semakin kuat dan tidak mudah lupa terhadap materi yang sudah dipelajari.",
      "Semoga {{firstname}} terus menjaga semangat belajarnya dan tidak ragu untuk bertanya ketika mengalami kesulitan agar proses belajarnya semakin maksimal.",
      "{{firstname}} bisa mencoba memahami dasar konsep dengan lebih matang sebelum lanjut ke materi berikutnya agar tidak mengalami kesulitan di level selanjutnya.",
    ],
  },
  {
    id: "academic-suggestion",
    title: "Saran Akademik",
    group: "Saran",
    level: "growth",
    variants: [
      "Untuk hasil yang lebih optimal, {{firstname}} disarankan lebih rutin mengerjakan latihan tambahan agar konsep yang dipelajari semakin matang dan terbiasa menyelesaikan soal secara mandiri.",
      "Semoga {{firstname}} dapat lebih konsisten menyelesaikan tugas tepat waktu agar progres belajarnya lebih terarah dan stabil.",
    ],
  },
  {
    id: "activity-suggestion",
    title: "Saran Keaktifan & Percaya Diri",
    group: "Saran",
    level: "growth",
    variants: [
      "Diharapkan {{firstname}} dapat lebih aktif dalam berdiskusi dan menyampaikan pendapat di kelas agar kemampuan berpikir dan kepercayaan dirinya semakin berkembang.",
      "Semoga {{firstname}} bisa lebih percaya diri saat menjawab pertanyaan, karena kemampuan yang dimiliki sebenarnya sudah cukup baik.",
    ],
  },
  {
    id: "discipline-suggestion",
    title: "Saran Kedisiplinan",
    group: "Saran",
    level: "attention",
    variants: [
      "Ke depannya, diharapkan {{firstname}} bisa lebih disiplin dalam mengatur waktu agar selalu hadir tepat waktu dan tidak tertinggal materi penting.",
    ],
  },
  {
    id: "high-potential",
    title: "Saran untuk Murid Berpotensi Tinggi",
    group: "Saran",
    level: "positive",
    variants: [
      "Dengan kemampuan yang dimiliki saat ini, {{firstname}} sangat berpotensi untuk berkembang lebih jauh. Disarankan untuk mulai mencoba tantangan yang lebih kompleks agar kemampuannya semakin terasah.",
      "Ke depannya, {{firstname}} bisa mulai mengeksplorasi proyek mandiri untuk melatih kreativitas dan memperkuat pemahaman konsep yang telah dipelajari.",
    ],
  },
];

const groupTranslations: Record<string, string> = {
  Keaktifan: "Participation",
  Kehadiran: "Attendance",
  "Fokus & Tugas": "Focus & Assignments",
  Pemahaman: "Understanding",
  Kemandirian: "Independent Learning",
  Kolaborasi: "Collaboration",
  Ketangguhan: "Learning Resilience",
  Komunikasi: "Communication",
  Kreativitas: "Creativity",
  "Manajemen Proyek": "Project Management",
  "Strategi Belajar": "Learning Strategies",
  "Keterampilan Teknis": "Technical Skills",
  Evaluasi: "Assessment",
  "Kesiapan Belajar": "Learning Readiness",
  "Perjalanan Belajar": "Learning Progress",
  Pencapaian: "Achievements",
  "Literasi Digital": "Digital Literacy",
  Perkembangan: "Development",
  "Kendala Teknis": "Technical Challenges",
  "Murid Baru": "New Students",
  Kelulusan: "Program Completion",
  Saran: "Recommendations",
};

const englishContent: Record<string, [title: string, action: string]> = {
  excellent: ["Excellent Participation", "Encourage this strong engagement through increasingly challenging questions and activities."],
  "active-responsible": ["Active and Responsible", "Continued opportunities to take initiative will help strengthen this positive learning habit."],
  "focused-consistent": ["Focused and Consistent", "Encourage more frequent contributions so this solid understanding can also benefit class discussions."],
  "participation-push": ["Developing Classroom Participation", "A small goal, such as asking or answering one question per lesson, can build confidence."],
  "low-participation": ["Limited Verbal Participation", "Offer low-pressure opportunities to share an idea through speech, chat, or a short response."],
  passive: ["Inconsistent Classroom Responses", "Regular check-ins and simple response prompts can support more active involvement."],
  confidence: ["Developing Learning Confidence", "Encourage independent attempts before discussion and celebrate progress rather than only correct answers."],
  late: ["Frequent Lateness", "Arriving on time will help ensure important instructions and opening explanations are not missed."],
  absent: ["Inconsistent Attendance", "A clear catch-up plan and more regular attendance will support continuity in learning."],
  "inactive-late": ["Participation and Punctuality", "Setting one punctuality goal and one participation goal can make improvement easier to track."],
  "low-focus": ["Sustaining Focus During Lessons", "Short checkpoints and a distraction-free workspace can help maintain attention."],
  "task-consistency": ["Consistent Assignment Completion", "Breaking assignments into smaller deadlines can make completion more manageable."],
  "inactive-task": ["Participation and Assignment Completion", "Begin with one clearly defined task and provide a simple way to report progress."],
  "inactive-camera": ["Limited Online-Class Interaction", "Encourage responses through voice, chat, or another agreed method rather than relying on camera use alone."],
  "rapid-growth": ["Rapid Learning Growth", "Maintain the current practice routine while introducing gradually more demanding work."],
  "more-confident": ["Growing Confidence", "Continue providing opportunities to ask questions, attempt answers, and explain independent work."],
  "extra-guidance": ["Additional Guidance", "Targeted practice on one foundational concept at a time will make support more effective."],
  "quick-needs-accuracy": ["Quick Understanding and Accuracy", "A short review checklist before submission will help reduce avoidable errors."],
  "steady-paced-progress": ["Steady, Step-by-Step Progress", "Consistent practice at a manageable pace will continue to strengthen understanding."],
  "theory-to-practice": ["Applying Concepts in Practice", "Use varied examples and small independent projects to connect theory with application."],
  "strengthen-foundations": ["Stronger Foundational Understanding", "Review core concepts with simple examples before increasing the level of difficulty."],
  "quiet-strong-understanding": ["Quiet Participation and Strong Understanding", "Invite occasional explanations of completed work without treating quietness as a weakness."],
  "active-needs-concept": ["Active Participation and Conceptual Depth", "Ask for the reasoning behind each answer to help turn enthusiasm into deeper understanding."],
  "independent-problem-solver": ["Independent Problem Solving", "Continue encouraging comparison of different solutions and reflection on the chosen approach."],
  "needs-step-guidance": ["Developing Learning Independence", "Have them plan and attempt the first step before requesting the next piece of guidance."],
  "asks-help-early": ["Trying Before Requesting Help", "Use a read, try, note, and ask routine to make help-seeking more productive."],
  "self-review-habit": ["Effective Self-Review", "Maintain the habit of checking work and identifying one improvement after each task."],
  "fast-needs-challenge": ["Readiness for Additional Challenges", "Provide open-ended extensions or an independent project with more than one possible solution."],
  "perfectionism-pacing": ["Careful Work and Time Management", "Set separate time limits for drafting, testing, and polishing to balance quality with completion."],
  "supportive-peer": ["Supportive Peer Collaboration", "Encourage continued support while allowing classmates enough time to solve problems themselves."],
  "discussion-balance": ["Balanced Contribution in Discussions", "Practice inviting others to speak and summarizing different viewpoints before deciding."],
  "group-participation": ["Active Group Contribution", "Assigning a clear role can make participation more comfortable and measurable."],
  "receptive-to-feedback": ["Applying Feedback Effectively", "Continue using feedback to guide revisions and begin identifying improvements independently."],
  "explains-reasoning": ["Clear Explanation of Reasoning", "Extend this skill by comparing alternative approaches and explaining their trade-offs."],
  "persistent-debugging": ["Persistence Through Challenges", "Maintain the habit of testing one possibility at a time and recording what has been tried."],
  "frustrated-by-errors": ["Strategies for Handling Errors", "Pause, read the error carefully, and test one small change at a time."],
  "learns-from-mistakes": ["Learning Positively from Mistakes", "Continue reviewing the cause of each error and applying that lesson to future work."],
  "inconsistent-motivation": ["Consistent Learning Motivation", "Small goals and visible progress markers can help maintain momentum between lessons."],
  "tries-new-strategies": ["Trying New Strategies", "Keep experimenting while checking each approach against the task requirements."],
  "structured-explanation": ["Structured Explanations", "Organize responses around the problem, the chosen strategy, and the final result."],
  "clear-presentation": ["Clear and Focused Presentation", "Continue supporting key points with relevant examples and concise explanations."],
  "presentation-confidence": ["Presentation Confidence", "Practice one short section at a time using a few key points as prompts."],
  "active-listening": ["Active Listening", "Wait for others to finish, summarize the main point, and then add a response."],
  "specific-questions": ["Specific and Productive Questions", "Maintain the habit of explaining what has already been tried before asking for help."],
  "creative-solution": ["Creative Solutions", "Continue exploring original approaches while testing that each solution meets the task goals."],
  "extends-project": ["Extending Projects Beyond the Brief", "Complete and test the required features before adding thoughtful extensions."],
  "adapt-the-example": ["Adapting Provided Examples", "Change one element, use different data, or add a small feature to build ownership of the work."],
  "ideas-to-execution": ["Turning Ideas into Completed Work", "Choose one main goal, finish a simple version, and add other ideas in stages."],
  "curious-explorer": ["Curiosity and Exploration", "Record questions and experiment results so exploration also builds organized knowledge."],
  "plans-milestones": ["Planning Project Milestones", "Continue defining clear goals, priorities, and completion checks before beginning."],
  "procrastination-pattern": ["Starting Work Earlier", "Use small personal deadlines from the beginning instead of relying on the final due date."],
  "starts-needs-finishing": ["Following Work Through to Completion", "Define what finished means and complete the core requirement before starting something new."],
  "quality-late-delivery": ["Quality Work and Timely Submission", "Reserve separate time for core work and revision so quality does not delay submission."],
  "fast-needs-testing": ["Fast Completion and Thorough Testing", "Use remaining time to check requirements and test several different conditions."],
  "recognizes-learning-gaps": ["Recognizing Personal Learning Needs", "Continue identifying specific gaps and selecting practice that directly addresses them."],
  "effective-notes": ["Effective Learning Notes", "Add a brief reflection after each activity to make notes even more useful for review."],
  "read-instructions-carefully": ["Careful Reading of Instructions", "Highlight key requirements and check each one before submitting work."],
  "repeated-mistakes": ["Reducing Repeated Errors", "Keep an error log that records the cause, correction, and prevention strategy."],
  "learning-routine": ["A Consistent Practice Routine", "A short, realistic practice goal between lessons will strengthen long-term retention."],
  "strong-programming-logic": ["Strong Programming Logic", "Continue planning the solution in small logical steps before writing code."],
  "syntax-needs-practice": ["Strong Logic and Developing Syntax", "Frequent short exercises and careful reading of error messages will improve accuracy."],
  "independent-debugging": ["Independent Debugging", "Continue isolating problems, testing one change at a time, and verifying the result."],
  "code-readability": ["Code Readability and Organization", "Use consistent indentation, descriptive names, and smaller well-defined sections of code."],
  "technical-testing": ["Technical Testing Skills", "Create a short list of normal, unusual, and incorrect inputs to test before submission."],
  "class-to-assessment": ["Applying Classroom Learning in Assessments", "Timed independent practice with varied questions will improve assessment readiness."],
  "improving-assessment-results": ["Improving Assessment Results", "Maintain the review habits that are producing this consistent improvement."],
  "assessment-time-management": ["Assessment Time Management", "Allocate time by question difficulty and return to challenging items after completing easier ones."],
  "complete-assessment-answers": ["Complete Assessment Responses", "Check that every part of each question is answered with relevant reasoning."],
  "strong-assessment-revision": ["Strong Assessment Revision", "Continue using corrections to understand mistakes rather than only changing the final answer."],
  "punctual-and-prepared": ["Punctual and Ready to Learn", "Maintain this preparation so lesson time can be used fully and effectively."],
  "reviews-previous-material": ["Connecting Previous and New Learning", "Continue reviewing earlier material and identifying links to each new topic."],
  "slow-task-start": ["Starting Tasks Promptly", "Prepare materials, read the instructions, and identify the first action at the beginning of class."],
  "prepare-device-before-class": ["Device Readiness Before Class", "Check power, connectivity, accounts, applications, and files before the lesson begins."],
  "previews-upcoming-material": ["Preparing for Upcoming Material", "Continue previewing topics and bringing one or two initial questions to class."],
  "steady-learning-journey": ["Stable and Sustainable Progress", "Maintain the consistent attendance, practice, and response to feedback supporting this growth."],
  "learning-plateau": ["Moving Beyond a Learning Plateau", "Set one specific new skill target and use a different type of practice to restart progress."],
  "catching-up-material": ["Catching Up on Missed Material", "Prioritize essential concepts and complete catch-up work in manageable stages."],
  "returning-engagement": ["Renewed Engagement After a Setback", "Use small, consistent goals to protect this positive return to learning."],
  "concept-breakthrough": ["A Breakthrough in a Challenging Concept", "Use this achievement as evidence that persistence and gradual practice lead to growth."],
  "first-completed-project": ["First Completed Project", "Celebrate the full process and use the experience as a foundation for the next project."],
  "first-independent-task": ["First Independently Completed Assignment", "Continue building independence while maintaining the habit of reviewing work."],
  "first-presentation": ["First Presentation", "Acknowledge this step and provide another short, supportive opportunity to present."],
  "improved-task-submission": ["Improved Assignment Submission", "Maintain the routines that have made completion and punctuality more consistent."],
  "mastered-difficult-topic": ["Mastery of a Challenging Topic", "Reinforce this achievement by explaining the concept or applying it in a new context."],
  "responsible-references": ["Responsible Use of References", "Continue comparing sources and adapting relevant information rather than copying it directly."],
  "explains-ai-assisted-work": ["Explaining AI-Assisted Work", "Keep reviewing, testing, and adapting AI output before using it in an assignment."],
  "overreliance-on-tools": ["Independent Thinking When Using Digital Tools", "Create an initial solution first, then use tools to review or extend the work."],
  "source-attribution": ["Consistent Source Attribution", "Record the author, title, or link whenever outside material supports an assignment."],
  "digital-class-etiquette": ["Digital Classroom Etiquette", "Keep messages relevant, respectful, and clear while allowing others time to respond."],
  device: ["Device or Technical Difficulties", "Prepare a backup option where possible and record missed instructions when disruptions occur."],
  internet: ["Internet Connectivity Challenges", "A backup connection or access to lesson materials afterward can reduce missed learning."],
  "device-performance": ["Limited Device Performance", "Simplifying the working setup or arranging technical support may improve lesson continuity."],
  "technical-effort": ["Persistence Despite Technical Challenges", "Recognize this effort and continue using practical backup strategies when problems occur."],
  "technical-support": ["Recurring Technical Barriers", "Identify the recurring issue and arrange focused support before the next lesson."],
  "new-adapting": ["New Student Adjustment", "Provide predictable routines and low-pressure opportunities to become familiar with the class."],
  "new-fast": ["Quick Adjustment as a New Student", "Continue offering opportunities to connect with classmates and contribute ideas."],
  "new-shy": ["Building Comfort as a New Student", "Start with written or small-group responses while confidence develops."],
  "new-potential": ["Strong Potential as a New Student", "Consistent practice and clear goals will help this early potential develop."],
  graduated: ["Program Completion", "Celebrate the progress made and identify a meaningful next learning challenge."],
  "general-suggestion": ["General Development Recommendation", "Set one realistic practice goal and review progress regularly."],
  "academic-suggestion": ["Academic Recommendation", "Use regular independent practice to strengthen understanding and assignment consistency."],
  "activity-suggestion": ["Participation and Confidence Recommendation", "Provide frequent, manageable opportunities to ask questions and share ideas."],
  "discipline-suggestion": ["Time-Management Recommendation", "Use reminders and a simple routine to support punctual attendance and timely work."],
  "high-potential": ["Recommendation for a High-Potential Student", "Offer more complex challenges and an independent project that encourages creativity."],
};

function createEnglishVariant(
  title: string,
  action: string,
  level: FeedbackItem["level"],
  index: number,
) {
  const topic = title.toLocaleLowerCase("en");
  const openers = {
    positive: [
      `{{firstname}} has demonstrated ${topic}.`,
      `During recent lessons, {{firstname}} has consistently shown ${topic}.`,
      `{{firstname}} continues to make encouraging progress through ${topic}.`,
    ],
    growth: [
      `{{firstname}} is making progress, while ${topic} remains an important area for development.`,
      `Recent work shows that {{firstname}} would benefit from further development in ${topic}.`,
      `With focused support, {{firstname}} can build greater consistency in ${topic}.`,
    ],
    attention: [
      `{{firstname}} currently needs additional support with ${topic}.`,
      `Closer attention to ${topic} would help {{firstname}} make more consistent progress.`,
      `${title} is an important priority for {{firstname}} at this stage.`,
    ],
    technical: [
      `{{firstname}}'s learning has been affected by ${topic}.`,
      `Technical conditions related to ${topic} have occasionally interrupted {{firstname}}'s learning.`,
      `Addressing ${topic} would help {{firstname}} participate more consistently.`,
    ],
    milestone: [
      `{{firstname}} has reached an important milestone: ${topic}.`,
      `A meaningful achievement for {{firstname}} is ${topic}.`,
      `{{firstname}} should be proud of this progress in ${topic}.`,
    ],
  } satisfies Record<FeedbackItem["level"], string[]>;

  return `${openers[level][index % openers[level].length]} ${action}`;
}

const englishFeedbacks: FeedbackItem[] = feedbackSource.map((feedback) => {
  const content = englishContent[feedback.id];
  if (!content) throw new Error(`Missing English content for ${feedback.id}`);
  const [title, action] = content;

  return {
    ...feedback,
    title,
    group: feedback.group,
    keywords: undefined,
    variants: feedback.variants.map((_, index) =>
      createEnglishVariant(title, action, feedback.level, index),
    ),
  };
});

const ui = {
  id: {
    brand: "Ruang Feedback",
    situations: "situasi",
    templates: "template",
    theme: "Tema",
    themeLabel: "Ganti tema terang atau gelap",
    languageLabel: "Pilih bahasa",
    eyebrow: "Asisten feedback untuk pengajar",
    heading: "Feedback yang tepat untuk setiap murid.",
    description: "Pilih situasi, sesuaikan teks, lalu salin.",
    studentName: "Nama murid",
    namePlaceholder: "Contoh: Ando",
    clearName: "Hapus nama murid",
    nameHint: "Otomatis diterapkan pada feedback yang dipilih.",
    categoryFilter: "Filter berdasarkan kategori",
    category: "Kategori",
    all: "Semua",
    allCategories: "Semua kategori",
    library: "Pustaka feedback",
    allSituations: "Semua situasi",
    situation: "situasi",
    selected: "Feedback terpilih",
    chooseVariation: "Pilih variasi",
    variationLabel: "Pilih variasi",
    feedbackText: "Teks feedback",
    characters: "karakter",
    restore: "Pulihkan template",
    copy: "Salin feedback",
    copied: "Tersalin ke clipboard",
    editorHint: "Teks dapat diedit langsung sebelum disalin.",
    footer: "Feedback personal untuk setiap proses belajar.",
    backToTop: "Kembali ke atas ↑",
    confirmLanguage:
      "Mengganti bahasa akan menggantikan teks yang telah Anda edit. Lanjutkan?",
    levels: {
      positive: "Apresiasi",
      attention: "Perlu perhatian",
      technical: "Teknis",
      milestone: "Pencapaian",
      growth: "Pengembangan",
    },
  },
  en: {
    brand: "Feedback Space",
    situations: "situations",
    templates: "templates",
    theme: "Theme",
    themeLabel: "Toggle light or dark theme",
    languageLabel: "Choose language",
    eyebrow: "Feedback assistant for educators",
    heading: "The right feedback for every student.",
    description: "Choose a situation, personalize the text, and copy.",
    studentName: "Student name",
    namePlaceholder: "Example: Andrew",
    clearName: "Clear student name",
    nameHint: "Automatically applied to the selected feedback.",
    categoryFilter: "Filter by category",
    category: "Category",
    all: "All",
    allCategories: "All categories",
    library: "Feedback library",
    allSituations: "All situations",
    situation: "situation",
    selected: "Selected feedback",
    chooseVariation: "Choose a variation",
    variationLabel: "Choose variation",
    feedbackText: "Feedback text",
    characters: "characters",
    restore: "Restore template",
    copy: "Copy feedback",
    copied: "Copied to clipboard",
    editorHint: "You can edit the text before copying it.",
    footer: "Personal feedback for every learning journey.",
    backToTop: "Back to top ↑",
    confirmLanguage:
      "Switching languages will replace your edited text. Continue?",
    levels: {
      positive: "Appreciation",
      attention: "Needs attention",
      technical: "Technical",
      milestone: "Achievement",
      growth: "Development",
    },
  },
} as const;

function localizedGroup(group: string, language: Language) {
  return language === "id" ? group : groupTranslations[group];
}

function withName(text: string, name: string) {
  return text.replaceAll("{{firstname}}", name.trim() || "{{firstname}}");
}

export default function Home() {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );
  const t = ui[language];
  const localizedFeedbacks =
    language === "id" ? feedbackSource : englishFeedbacks;
  const [studentName, setStudentName] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [selectedId, setSelectedId] = useState(englishFeedbacks[0].id);
  const [variantIndex, setVariantIndex] = useState(0);
  const [draft, setDraft] = useState(() =>
    withName(englishFeedbacks[0].variants[0], ""),
  );
  const [draftLanguage, setDraftLanguage] = useState<Language>("en");
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  const selected =
    localizedFeedbacks.find((feedback) => feedback.id === selectedId) ??
    localizedFeedbacks[0];

  const visibleFeedbacks =
    activeGroup === "all"
      ? localizedFeedbacks
      : localizedFeedbacks.filter(
          (feedback) => feedback.group === activeGroup,
        );

  const currentDraft =
    draftLanguage === language
      ? draft
      : withName(selected.variants[variantIndex], studentName);

  function toggleTheme() {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const nextTheme = isDark ? "light" : "dark";
    root.dataset.theme = nextTheme;
    window.localStorage.setItem("feedback-theme", nextTheme);
  }

  function changeLanguage(nextLanguage: Language) {
    if (nextLanguage === language) return;
    if (isDirty && !window.confirm(t.confirmLanguage)) return;

    const nextFeedbacks =
      nextLanguage === "id" ? feedbackSource : englishFeedbacks;
    const nextSelected =
      nextFeedbacks.find((feedback) => feedback.id === selectedId) ??
      nextFeedbacks[0];
    const nextVariantIndex = Math.min(
      variantIndex,
      nextSelected.variants.length - 1,
    );

    setVariantIndex(nextVariantIndex);
    setDraft(
      withName(nextSelected.variants[nextVariantIndex], studentName),
    );
    setDraftLanguage(nextLanguage);
    setIsDirty(false);
    setCopied(false);
    saveLanguage(nextLanguage);
    document.title =
      nextLanguage === "id"
        ? "Ruang Feedback — Template Feedback Murid"
        : "Feedback Space — Student Feedback Templates";
  }

  function chooseFeedback(id: string) {
    const nextFeedback =
      localizedFeedbacks.find((feedback) => feedback.id === id) ??
      localizedFeedbacks[0];
    setSelectedId(id);
    setVariantIndex(0);
    setDraft(withName(nextFeedback.variants[0], studentName));
    setDraftLanguage(language);
    setIsDirty(false);
    setCopied(false);
    if (window.innerWidth <= 860) {
      requestAnimationFrame(() =>
        document
          .getElementById("editor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  function selectVariant(index: number) {
    setVariantIndex(index);
    setDraft(withName(selected.variants[index], studentName));
    setDraftLanguage(language);
    setIsDirty(false);
    setCopied(false);
  }

  async function copyDraft() {
    if (!currentDraft.trim()) return;
    try {
      await navigator.clipboard.writeText(currentDraft);
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = currentDraft;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const totalVariants = localizedFeedbacks.reduce(
    (total, feedback) => total + feedback.variants.length,
    0,
  );

  return (
    <main>
      <header className="topbar" id="top">
        <a className="brand" href="#top" aria-label={t.brand}>
          <span className="brand-mark" aria-hidden="true">
            {language === "id" ? "R" : "F"}
          </span>
          <span>{t.brand}</span>
        </a>
        <div className="topbar-actions">
          <span className="library-count">
            {localizedFeedbacks.length} {t.situations} · {totalVariants}{" "}
            {t.templates}
          </span>
          <div className="language-toggle" aria-label={t.languageLabel}>
            <button
              type="button"
              className={language === "id" ? "active" : ""}
              onClick={() => changeLanguage("id")}
              aria-pressed={language === "id"}
            >
              ID
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => changeLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={t.themeLabel}
          >
            <span aria-hidden="true">◐</span>
            {t.theme}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.heading}</h1>
          <p className="hero-description">{t.description}</p>
        </div>
        <div className="name-panel">
          <label htmlFor="student-name">{t.studentName}</label>
          <div className="name-input-wrap">
            <input
              id="student-name"
              value={studentName}
              onChange={(event) => {
                const nextName = event.target.value;
                setStudentName(nextName);
                setDraft(
                  withName(selected.variants[variantIndex], nextName),
                );
                setDraftLanguage(language);
                setIsDirty(false);
                setCopied(false);
              }}
              placeholder={t.namePlaceholder}
              autoComplete="off"
            />
            {studentName && (
              <button
                type="button"
                className="clear-name"
                onClick={() => {
                  setStudentName("");
                  setDraft(
                    withName(selected.variants[variantIndex], ""),
                  );
                  setDraftLanguage(language);
                  setIsDirty(false);
                  setCopied(false);
                }}
                aria-label={t.clearName}
              >
                ×
              </button>
            )}
          </div>
          <p>{t.nameHint}</p>
        </div>
      </section>

      <nav className="category-nav" aria-label={t.categoryFilter}>
        <div className="category-buttons">
          <button
            type="button"
            className={activeGroup === "all" ? "active" : ""}
            onClick={() => setActiveGroup("all")}
          >
            {t.all}
          </button>
          {sourceGroups.map((group) => (
            <button
              type="button"
              className={activeGroup === group ? "active" : ""}
              onClick={() => setActiveGroup(group)}
              key={group}
            >
              {localizedGroup(group, language)}
            </button>
          ))}
        </div>
        <label className="category-select">
          <span>{t.category}</span>
          <select
            value={activeGroup}
            onChange={(event) => setActiveGroup(event.target.value)}
          >
            <option value="all">{t.allCategories}</option>
            {sourceGroups.map((group) => (
              <option value={group} key={group}>
                {localizedGroup(group, language)}
              </option>
            ))}
          </select>
        </label>
      </nav>

      <section className="workspace">
        <div className="library-panel">
          <div className="library-heading">
            <div>
              <p className="eyebrow">{t.library}</p>
              <h2>
                {activeGroup === "all"
                  ? t.allSituations
                  : localizedGroup(activeGroup, language)}
              </h2>
            </div>
            <span>
              {visibleFeedbacks.length}{" "}
              {t.situation}
            </span>
          </div>

          <div className="feedback-grid">
            {visibleFeedbacks.map((feedback) => (
              <button
                type="button"
                key={feedback.id}
                className={`feedback-card ${
                  selected.id === feedback.id ? "selected" : ""
                }`}
                onClick={() => chooseFeedback(feedback.id)}
                aria-pressed={selected.id === feedback.id}
              >
                <span className={`level-dot ${feedback.level}`} />
                <span className="card-content">
                  <span className="card-group">
                    {localizedGroup(feedback.group, language)}
                  </span>
                  <strong>{feedback.title}</strong>
                  <small>
                    {t.levels[feedback.level]} · {feedback.variants.length}{" "}
                    {feedback.variants.length === 1
                      ? t.templates.replace(/s$/, "")
                      : language === "id"
                        ? "variasi"
                        : "variations"}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside className="editor-panel" id="editor">
          <div className="editor-card">
            <div className="editor-topline">
              <span className="editor-kicker">{t.selected}</span>
              <span className={`level-badge ${selected.level}`}>
                {t.levels[selected.level]}
              </span>
            </div>
            <h2>{selected.title}</h2>

            {selected.variants.length > 1 && (
              <div className="variant-nav">
                <span>{t.chooseVariation}</span>
                <div>
                  {selected.variants.map((_, index) => (
                    <button
                      type="button"
                      className={variantIndex === index ? "active" : ""}
                      onClick={() => selectVariant(index)}
                      aria-label={`${t.variationLabel} ${index + 1}`}
                      aria-pressed={variantIndex === index}
                      key={index}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="draft-label" htmlFor="feedback-draft">
              {t.feedbackText}
            </label>
            <textarea
              id="feedback-draft"
              value={currentDraft}
              onChange={(event) => {
                setDraft(event.target.value);
                setDraftLanguage(language);
                setIsDirty(true);
                setCopied(false);
              }}
              rows={10}
            />
            <div className="draft-meta">
              <span>
                {currentDraft.length} {t.characters}
              </span>
              <button
                type="button"
                className="reset-draft"
                onClick={() => {
                  setDraft(
                    withName(selected.variants[variantIndex], studentName),
                  );
                  setDraftLanguage(language);
                  setIsDirty(false);
                  setCopied(false);
                }}
              >
                {t.restore}
              </button>
            </div>

            <button
              type="button"
              className={`copy-button ${copied ? "copied" : ""}`}
              onClick={copyDraft}
            >
              <span>{copied ? "✓" : "▣"}</span>
              {copied ? t.copied : t.copy}
            </button>
            <p className="editor-note">{t.editorHint}</p>
          </div>
        </aside>
      </section>

      <footer>
        <span>{t.brand}</span>
        <p>{t.footer}</p>
        <a href="#top">{t.backToTop}</a>
      </footer>
    </main>
  );
}
