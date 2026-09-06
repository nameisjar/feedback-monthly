"use client";

import { useMemo, useState } from "react";

type FeedbackItem = {
  id: string;
  title: string;
  group: string;
  level: "positive" | "attention" | "technical" | "milestone" | "growth";
  keywords?: string[];
  variants: string[];
};

const groups = [
  "Semua",
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

const feedbacks: FeedbackItem[] = [
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

const levelLabels = {
  positive: "Apresiasi",
  attention: "Perlu perhatian",
  technical: "Teknis",
  milestone: "Pencapaian",
  growth: "Pengembangan",
};

function withName(text: string, name: string) {
  return text.replaceAll("{{firstname}}", name.trim() || "{{firstname}}");
}

export default function Home() {
  const [studentName, setStudentName] = useState("");
  const [activeGroup, setActiveGroup] = useState("Semua");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(feedbacks[0].id);
  const [variantIndex, setVariantIndex] = useState(0);
  const [draft, setDraft] = useState(() =>
    withName(feedbacks[0].variants[0], ""),
  );
  const [copied, setCopied] = useState(false);

  const selected =
    feedbacks.find((feedback) => feedback.id === selectedId) ?? feedbacks[0];

  const filteredFeedbacks = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id");
    return feedbacks.filter((feedback) => {
      const matchesGroup =
        activeGroup === "Semua" || feedback.group === activeGroup;
      const matchesSearch =
        !keyword ||
        feedback.title.toLocaleLowerCase("id").includes(keyword) ||
        feedback.group.toLocaleLowerCase("id").includes(keyword) ||
        feedback.keywords?.some((item) =>
          item.toLocaleLowerCase("id").includes(keyword),
        ) ||
        feedback.variants.some((variant) =>
          variant.toLocaleLowerCase("id").includes(keyword),
        );
      return matchesGroup && matchesSearch;
    });
  }, [activeGroup, query]);

  function chooseFeedback(id: string) {
    const nextFeedback =
      feedbacks.find((feedback) => feedback.id === id) ?? feedbacks[0];
    setSelectedId(id);
    setVariantIndex(0);
    setDraft(withName(nextFeedback.variants[0], studentName));
    setCopied(false);
    if (window.innerWidth < 980) {
      requestAnimationFrame(() =>
        document
          .getElementById("editor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }

  function changeVariant(direction: number) {
    const total = selected.variants.length;
    const nextIndex = (variantIndex + direction + total) % total;
    setVariantIndex(nextIndex);
    setDraft(withName(selected.variants[nextIndex], studentName));
    setCopied(false);
  }

  async function copyDraft() {
    if (!draft.trim()) return;
    try {
      await navigator.clipboard.writeText(draft);
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = draft;
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

  const totalVariants = feedbacks.reduce(
    (total, feedback) => total + feedback.variants.length,
    0,
  );

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Ruang Feedback">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          <span>Ruang Feedback</span>
        </a>
        <span className="library-count">
          {feedbacks.length} kategori · {totalVariants} template
        </span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Asisten feedback untuk pengajar</p>
          <h1>
            Temukan kalimat yang
            <br />
            <em>tepat untuk setiap murid.</em>
          </h1>
          <p className="hero-description">
            Pilih kategori, sesuaikan nama, lalu salin feedback yang siap
            dikirim—tanpa menyusun ulang dari awal.
          </p>
        </div>
        <div className="name-panel">
          <span className="step-label">01 · Mulai dari nama</span>
          <label htmlFor="student-name">Nama murid</label>
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
                setCopied(false);
              }}
              placeholder="Contoh: Ando"
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
                  setCopied(false);
                }}
                aria-label="Hapus nama murid"
              >
                ×
              </button>
            )}
          </div>
          <p>
            Nama akan otomatis menggantikan{" "}
            <code>{"{{firstname}}"}</code> di template.
          </p>
        </div>
      </section>

      <section className="workspace">
        <div className="library-panel">
          <div className="section-heading">
            <div>
              <span className="step-label">02 · Pilih situasi murid</span>
              <h2>Kategori feedback</h2>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari kategori…"
                aria-label="Cari kategori feedback"
              />
            </label>
          </div>

          <div className="group-tabs" aria-label="Filter kategori">
            {groups.map((group) => (
              <button
                type="button"
                className={activeGroup === group ? "active" : ""}
                key={group}
                onClick={() => setActiveGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="result-summary">
            <span>
              Menampilkan <strong>{filteredFeedbacks.length}</strong> kategori
            </span>
            {(query || activeGroup !== "Semua") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveGroup("Semua");
                }}
              >
                Reset filter
              </button>
            )}
          </div>

          <div className="feedback-grid">
            {filteredFeedbacks.map((feedback) => (
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
                  <span className="card-group">{feedback.group}</span>
                  <strong>{feedback.title}</strong>
                  <small>
                    {feedback.variants.length}{" "}
                    {feedback.variants.length === 1 ? "template" : "variasi"}
                  </small>
                </span>
                <span className="card-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>

          {filteredFeedbacks.length === 0 && (
            <div className="empty-state">
              <span>⌕</span>
              <h3>Kategori belum ditemukan</h3>
              <p>Coba kata kunci lain atau tampilkan semua kategori.</p>
            </div>
          )}
        </div>

        <aside className="editor-panel" id="editor">
          <div className="editor-card">
            <div className="editor-topline">
              <span className="step-label">03 · Sesuaikan & salin</span>
              <span className={`level-badge ${selected.level}`}>
                {levelLabels[selected.level]}
              </span>
            </div>
            <h2>{selected.title}</h2>

            {selected.variants.length > 1 && (
              <div className="variant-nav">
                <span>
                  Variasi {variantIndex + 1} dari {selected.variants.length}
                </span>
                <div>
                  <button
                    type="button"
                    onClick={() => changeVariant(-1)}
                    aria-label="Variasi sebelumnya"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => changeVariant(1)}
                    aria-label="Variasi berikutnya"
                  >
                    →
                  </button>
                </div>
              </div>
            )}

            <label className="draft-label" htmlFor="feedback-draft">
              Teks feedback
            </label>
            <textarea
              id="feedback-draft"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setCopied(false);
              }}
              rows={10}
            />
            <div className="draft-meta">
              <span>{draft.length} karakter</span>
              <button
                type="button"
                className="reset-draft"
                onClick={() =>
                  setDraft(
                    withName(selected.variants[variantIndex], studentName),
                  )
                }
              >
                Pulihkan template
              </button>
            </div>

            <button
              type="button"
              className={`copy-button ${copied ? "copied" : ""}`}
              onClick={copyDraft}
            >
              <span>{copied ? "✓" : "▣"}</span>
              {copied ? "Tersalin ke clipboard" : "Salin feedback"}
            </button>
            <p className="editor-note">
              Anda bisa mengedit teks langsung sebelum menyalinnya.
            </p>
          </div>

          <div className="legend">
            <span>
              <i className="positive" /> Apresiasi
            </span>
            <span>
              <i className="growth" /> Pengembangan
            </span>
            <span>
              <i className="attention" /> Perlu perhatian
            </span>
          </div>
        </aside>
      </section>

      <footer>
        <span>Ruang Feedback</span>
        <p>Dibuat untuk membantu pengajar memberi perhatian yang personal.</p>
        <a href="#top">Kembali ke atas ↑</a>
      </footer>
    </main>
  );
}
