export type Story = {
  slug: string;
  title: string;
  product: string;
  detail: string;
  description: string;
  route: string;
  image: string;
  imageAlt: string;
  fact: string;
  chapters: Array<{ label: string; title: string; body: string }>;
  sourceLabel: string;
  sourceUrl: string;
};

export const stories: Story[] = [
  {
    slug: "hinoki-va-bac-chan-tu",
    title: "Hinoki và bậc chân tu",
    product: "Gỗ Bách Nhật Hinoki & Trầm Không Tăm",
    detail: "Khoảng lặng thiền định của sương mai thung lũng Kiso",
    description: "Hương gỗ bách Hinoki thanh sạch, mộc mạc như bước chân của bậc chân tu qua những thềm đá phủ rêu xanh sau cơn mưa sớm.",
    route: "Chamaecyparis obtusa · Rừng bách Kiso · Thiền viện Nhật Bản",
    image: "/images/stories/hinoki-va-bac-chan-tu.jpg",
    imageAlt: "Đoàn bậc chân tu áo trắng che ô đi dưới cổng Torii trong rừng xanh ngắt",
    fact: "Hinoki (Chamaecyparis obtusa) là loài cây gỗ thiêng bản địa Nhật Bản, từng dùng dựng nên các công trình đền chùa cổ ngàn năm tuổi. Tinh dầu hinoki chứa hàm lượng phytoncide dồi dào — hoạt chất tự nhiên giúp giải tỏa căng thẳng thần kinh, làm dịu nhịp thở và tái tạo năng lượng sống.",
    chapters: [
      { label: "01 · Rừng Kiso", title: "Thung lũng của những tán bách ngàn năm", body: "Nằm nép mình giữa rặng núi Alps Nhật Bản, thung lũng Kiso quanh năm phủ sương mờ và hơi ẩm mát lành. Những thân cây Hinoki vươn thẳng tắp lên nền trời, tỏa ra mùi hương gỗ thanh thoát, khô ráo và tinh khiết đến từng giác quan." },
      { label: "02 · Bậc chân tu", title: "Tiếng bước chân chạm vào thềm rêu ướt", body: "Bậc chân tu quét lá sớm trên sân chùa, không một lời nói, chỉ có hơi thở đều đặn và tiếng chổi tre khẽ khàng. Hương Hinoki hòa cùng hơi nước bốc lên từ đá ẩm, tạo thành một ranh giới vô hình tách biệt hoàn toàn với những huyên náo trần thế." },
      { label: "03 · An định", title: "Một góc trà tĩnh mịch giữa đời thường", body: "Thắp một nén hương Hinoki trong căn phòng nhỏ, nhấp một ngụm trà ấm và dõi theo làn khói mỏng. Bạn nhận ra bình an không ở đâu xa xôi, mà hiện diện ngay trong sự tĩnh lặng mà bạn chọn giữ cho chính mình." },
    ],
    sourceLabel: "Forestry and Forest Products Research Institute Japan",
    sourceUrl: "https://www.ffpri.affrc.go.jp/",
  },
  {
    slug: "hoa-co-vut-bay",
    title: "Hoa cỏ vút bay",
    product: "Xô Thơm Trắng, Oải Hương & Cỏ Thảo Mộc",
    detail: "Ngọn gió tự do nâng tâm hồn bay bổng",
    description: "Xô thơm trắng, hoa dại và thảo mộc đan quyện vào nhau như một cánh đồng ngập nắng gió — trong trẻo, khoáng đạt và nâng bổng mọi giác quan.",
    route: "Salvia apiana · Lavandula · Thảo nguyên lộng gió California",
    image: "/images/stories/hoa-co-vut-bay.jpg",
    imageAlt: "Cửa sổ toa tàu lướt qua rặng hoa hồng rực rỡ đầy phiêu bồng",
    fact: "Xô thơm trắng (Salvia apiana) và các loài hoa dại thảo mộc vùng đồi khô khi phơi dưới nắng tự nhiên tích tụ hàm lượng tinh dầu cineole và terpene thực vật cao. Khi đốt hoặc khuếch tán, làn hương the mát thanh lọc không khí và khơi dậy nguồn cảm hứng sáng tạo khoáng đạt.",
    chapters: [
      { label: "01 · Cánh đồng", title: "Màu xanh bạc dưới bầu trời rộng mở", body: "Hoa cỏ vút bay bắt đầu từ những thung lũng ngập tràn nắng ấm, nơi xô thơm trắng phô bày sắc lá xanh bạc lấp lánh trong gió. Không gian ở đó bao la đến mức mọi âu lo dường như thu nhỏ lại và tan biến vào đường chân trời xa thẳm." },
      { label: "02 · Đôi cánh", title: "Khi hương thơm nâng bổng tâm trí", body: "Hương thơm thảo mộc không trói buộc ta vào bất kỳ chiếc hộp nào. Nó the mát ở đầu mũi, mở toang các phế nang, mang theo vị ngọt dịu nhẹ của hoa dại và sự sảng khoái của ngọn gió sớm vừa thổi qua rặng đồi." },
      { label: "03 · Tự do", title: "Bay trên những giới hạn tự đặt ra", body: "Đôi khi ta quên mất rằng mình có quyền nhẹ nhõm. Một làn hương hoa cỏ bay bổng là lời nhắc nhở dịu dàng: hãy buông lỏng đôi vai, để tâm hồn dang rộng đôi cánh và tự do lướt đi trên hành trình của riêng bạn." },
    ],
    sourceLabel: "USDA Forest Service · Native Plants Database",
    sourceUrl: "https://research.fs.usda.gov/treesearch/57258",
  },
  {
    slug: "mua-xuan",
    title: "Mùa xuân",
    product: "Nụ Tầm Xuân, Búp Trà Non & Vỏ Bưởi",
    detail: "Khởi đầu mới tràn đầy sức sống và hy vọng",
    description: "Hơi thở tươi mới của mầm chồi đâm chồi nảy lộc, sương mai trên búp trà xanh và hương vỏ bưởi ấm thanh. Một khởi đầu tràn ngập niềm vui và sinh khí bất tận.",
    route: "Camellia sinensis · Citrus grandis · Đồi trà sương sớm Tây Bắc",
    image: "/images/stories/mua-xuan.jpg",
    imageAlt: "Chuyến xe chở cành hoa đào đỏ thắm rực rỡ đón mùa xuân mới về",
    fact: "Hương búp trà xanh non (Camellia sinensis) kết hợp cùng tinh dầu vỏ bưởi chứa hàm lượng cao d-limonene và aldehyde tự nhiên có tác dụng giải phóng endorphin, khơi dậy tinh thần sảng khoái và tạo bầu không khí ấm cúng, tươi mới cho cả gian phòng.",
    chapters: [
      { label: "01 · Đâm chồi", title: "Hạt sương đọng trên búp non đầu mùa", body: "Mùa xuân không bắt đầu bằng sự ồn ào. Nó đến rất khẽ qua từng búp trà non vừa he hé mắt sau giấc ngủ đông dài, đón lấy tia nắng sớm ấm áp đầu tiên trên triền đồi Tây Bắc xanh ngút ngàn." },
      { label: "02 · Sinh khí", title: "Hương thơm của sự đâm chồi nảy lộc", body: "Vị chát ngọt thanh tao của trà hòa cùng hương the thơm dịu của vỏ bưởi sấy mộc tạo nên một bản hòa ca rộn rã mà thanh sạch. Nó gột rửa mọi u ám của mùa cũ, mang lại cảm giác tràn đầy năng lượng và hy vọng mới." },
      { label: "03 · Khởi đầu", title: "Mỗi ngày đều là một mùa xuân mới", body: "Mùa xuân không chỉ là một mùa trong năm, mà là một trạng thái của tâm hồn. Mỗi sớm mai thức dậy, khi ngửi thấy mùi hương thảo mộc tinh khôi, bạn biết rằng một hành trình mới rực rỡ và trọn vẹn lại đang bắt đầu." },
    ],
    sourceLabel: "Kew Gardens · Camellia sinensis",
    sourceUrl: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:828549-1",
  },
  {
    slug: "not-tram",
    title: "Nốt trầm",
    product: "Trầm Hương Xứ Quảng & Lọ Hương Mini",
    detail: "Sự lắng đọng và chiều sâu nội tâm",
    description: "Những nốt hương trầm ấm áp, trầm mặc và bền bỉ. Một khoảng dừng cần thiết giữa nhịp sống vội vã để lắng nghe những rung động tinh tế nhất của tâm hồn.",
    route: "Aquilaria crassna · Rừng nhiệt đới Quảng Nam · Việt Nam",
    image: "/images/stories/not-tram.jpg",
    imageAlt: "Người lướt sóng đơn độc trên làn sóng biển êm đềm trong ánh chiều tà",
    fact: "Trầm hương (Aquilaria crassna) hình thành từ cơ chế tự chữa lành kỳ diệu của cây Dó Bầu giữa rừng sâu nhiệt đới Việt Nam qua hàng chục năm. Hợp chất agarospirol quý giá tạo nên nốt trầm ngọt sâu, giúp định tâm an thần và nuôi dưỡng giấc ngủ thanh thản.",
    chapters: [
      { label: "01 · Dó Bầu", title: "Điều quý giá sinh ra từ vết thương tự lành", body: "Cây Dó Bầu bị gió bão làm rách vỏ hay côn trùng đục khoét sẽ tự tiết ra dòng nhựa thơm để băng bó vết thương. Qua năm tháng, dòng nhựa ấy hóa thành Trầm Hương — một nốt trầm kỳ diệu được sinh ra từ chính sự kiên cường và bao dung." },
      { label: "02 · Lắng sâu", title: "Khi mọi âm thanh ngoài kia chậm lại", body: "Khói trầm không nồng gắt mà lan tỏa nhẹ nhàng như một lời thầm thì. Nó đi thẳng vào tâm khảm, xua đi những xáo trộn và đưa tâm trí neo đậu vào hiện tại, nơi chỉ có hơi thở và sự tĩnh tại bao trùm." },
      { label: "03 · Khoảng lặng", title: "Giữ cho mình một căn phòng riêng", body: "Dù đi qua bao nhiêu thăng trầm hay bộn bề thường nhật, ai cũng cần một nốt trầm để cân bằng lại bản thân. Lọ hương trầm nhỏ bên mình là chốn nương náu ấm áp, nhắc bạn luôn yêu thương và lắng nghe chính mình." },
    ],
    sourceLabel: "Kew Gardens · Aquilaria crassna Pierre",
    sourceUrl: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:832870-1",
  },
  {
    slug: "tay-tang-huyen-bi",
    title: "Tây Tạng huyền bí",
    product: "Gỗ Thánh & Bách Xanh Tây Tạng",
    detail: "Hành trình thanh tẩy và thức tỉnh tâm thức",
    description: "Một câu chuyện về sự u huyền và mặc khải. Từ những triền núi cao nguyên tuyết trắng và nghi thức cổ xưa, khói thơm mở ra một khoảng lặng thanh khiết giữa đất trời.",
    route: "Cupressus funebris · Cao nguyên Tây Tạng · Linh khí núi thiêng",
    image: "/images/stories/tay-tang-huyen-bi.jpg",
    imageAlt: "Dãy núi sắc màu cao nguyên Tây Tạng kỳ vĩ cùng lữ khách và đàn lạc đà cừu",
    fact: "Gỗ bách tuyết Tây Tạng (Cupressus funebris / torulosa) sinh trưởng kiên cường trên các vách đá cheo leo ở độ cao trên 3.000m. Tinh dầu chứa các hợp chất sesquiterpene tự nhiên, qua hàng ngàn năm đã đồng hành cùng các tu viện Himalaya để làm sạch trường khí và đưa tâm trí vào trạng thái an định.",
    chapters: [
      { label: "01 · Nơi bắt đầu", title: "Một thân cây đi qua mùa tuyết", body: "Câu chuyện bắt đầu trên những sườn núi cao nơi mây ngưng đọng thành sương trắng. Ở độ cao nghìn mét, cây bách chắt chiu từng giọt nắng và mạch nước ngầm giá lạnh để kết tinh từng thớ gỗ sẫm màu, dày dặn và thơm ngát." },
      { label: "02 · Thời gian", title: "Hương thơm không thể vội vàng", body: "Gỗ bách và trầm cổ không kể câu chuyện của những gì vội vã. Càng trải qua phong ba và thời gian lắng đọng, nhựa thơm càng cô đọng. Khi chạm lửa, khói tỏa ra trong vắt, ấm áp và sâu lắng như tiếng chuông đồng vọng giữa thung lũng xa." },
      { label: "03 · Trở về", title: "Thanh tẩy không phải là xóa đi", body: "Với RUNGU, nghi thức khói thơm không mang nghĩa phủ nhận những gì đã xảy ra. Đó là khoảnh khắc mở rộng lòng mình, tạo một khoảng trống an yên để đón nhận năng lượng mới, đưa tâm hồn trở về với bản nguyên thuần khiết." },
    ],
    sourceLabel: "Kew · Plants of the World Online",
    sourceUrl: "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A127138-1/general-information",
  },
  {
    slug: "tu-do-tu-tai",
    title: "Tự do, Tự tại",
    product: "Gỗ Palo Santo & Nhựa Thơm Copal Nam Mỹ",
    detail: "Giải phóng năng lượng và dung dưỡng nội tại",
    description: "Một làn khói ngát hương cam chanh ấm áp từ Palo Santo và Copal đưa bạn thoát khỏi mọi khuôn khổ chật hẹp, tìm lại cảm giác thong dong, ung dung tự tại giữa đời thường.",
    route: "Bursera graveolens · Nhựa Copal · Rừng khô ven biển Peru",
    image: "/images/stories/tu-do-tu-tai.jpg",
    imageAlt: "Người thảnh thơi ngồi bên ban công đón nắng gió và nhìn ra biển rộng",
    fact: "Palo Santo (Bursera graveolens) và nhựa Copal từ lâu đã được xem là biểu tượng của sự thanh lọc và giải phóng tinh thần ở Nam Mỹ. Tinh dầu tự nhiên giàu limonene tạo cảm giác phấn chấn, xua tan năng lượng trì trệ và mang lại sự thông thoáng cho tâm thức.",
    chapters: [
      { label: "01 · Rừng ngã đổ", title: "Gỗ thánh tích tụ tinh dầu trong im lặng", body: "Cây Palo Santo sau khi hoàn tất vòng đời tự nhiên sẽ ngã xuống đất rừng, nằm yên đó từ 4 đến 10 năm để thớ gỗ tự chuyển hóa tinh dầu nhựa thơm. Đó là sự kiên nhẫn vĩ đại của tự nhiên để kiến tạo nên nguồn năng lượng nguyên sơ nhất." },
      { label: "02 · Ngọn lửa", title: "Ngọn lửa nhỏ thắp sáng sự thong dong", body: "Lửa bén vào thớ gỗ, bùng lên rồi tắt đi, để lại tàn than đỏ rực cùng dòng khói trắng mềm mại uốn lượn. Mùi cam chanh ngọt ấm lan tỏa, làm mềm đi mọi góc cạnh sắc nhọn của một ngày dài bận rộn." },
      { label: "03 · Tự tại", title: "Ung dung giữa dòng chảy cuộc đời", body: "Tự do không phải là chạy trốn khỏi cuộc sống, mà là giữ được tâm thế ung dung, tự tại ngay giữa mọi đổi thay. Giữ cho mình một khoảng lặng với Palo Santo là cách bạn gìn giữ vùng bình yên bất biến bên trong." },
    ],
    sourceLabel: "SERFOR Peru · Quản lý rừng bền vững",
    sourceUrl: "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A127138-1/general-information",
  },
];
