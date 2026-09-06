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
