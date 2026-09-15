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
    slug: "tay-tang-huyen-bi",
    title: "Tây Tạng huyền bí",
    product: "Gỗ Thánh",
    detail: "Hành trình thanh tẩy",
    description: "Một câu chuyện về sự u huyền và mặc khải. Từ những triền núi cao và nghi thức cổ xưa, Gỗ Thánh mang theo một làn khói trong trẻo để mở ra khoảng lặng mới.",
    route: "Bursera graveolens · Nam Mỹ · Rừng khô nhiệt đới",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bursera%20graveolens.jpg?width=1800",
    imageAlt: "Cây Bursera graveolens, thường được gọi là palo santo",
    fact: "Trong thực vật học, tên palo santo thường chỉ Bursera graveolens — một loài cây thuộc họ Burseraceae, có vùng bản địa từ Mexico đến tây bắc Venezuela và Peru, chủ yếu ở sinh cảnh nhiệt đới khô theo mùa.",
    chapters: [
      { label: "01 · Nơi bắt đầu", title: "Một thân cây đi qua mùa khô", body: "Câu chuyện bắt đầu ở những khu rừng khô theo mùa của vùng nhiệt đới châu Mỹ. Ở đó, nắng không chỉ làm đất nứt ra; nắng còn làm mọi mùi hương trở nên cô đặc hơn. Bursera graveolens lớn lên giữa gió nóng, đất sáng màu và những khoảng im lặng rộng đến mức người ta có thể nghe rõ tiếng lá chạm vào nhau." },
      { label: "02 · Thời gian", title: "Hương thơm không thể vội vàng", body: "Gỗ Thánh không kể câu chuyện của một nhành cây vừa bẻ. Điều làm nên sức gợi của nó là thời gian: thân gỗ được để lại, khô dần và lắng xuống trước khi trở thành vật phẩm. Khi gặp lửa, phần nhựa thơm thức dậy bằng làn khói ấm, sạch và có chiều sâu — như một cánh cửa mở ra trong căn phòng tối." },
      { label: "03 · Trở về", title: "Thanh tẩy không phải là xóa đi", body: "Với RUNGU, thanh tẩy không mang nghĩa phủ nhận những gì đã xảy ra. Đó là khoảnh khắc dọn một khoảng trống vừa đủ cho điều mới xuất hiện. Một vòng khói chậm quanh căn phòng, một ô cửa mở hé, vài phút không có thông báo — đôi khi, thế là đủ để trở về với chính mình." },
    ],
    sourceLabel: "Kew · Plants of the World Online",
    sourceUrl: "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A127138-1/general-information",
  },
  {
    slug: "co-cay-da-sac",
    title: "Cỏ cây đa sắc",
    product: "Xô thơm, hoa nhài, hoa hồng",
    detail: "Một câu chuyện về sự lãng mạn và say đắm",
    description: "Xô thơm, hoa nhài và hoa hồng đan vào nhau như một khu vườn lúc chạng vạng — mềm mại, sâu và đầy sức hút.",
    route: "Salvia apiana · Hoa nhài · Hoa hồng · Hương hoa",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1800&q=85",
    imageAlt: "Cụm hoa trắng và hồng trong ánh sáng tự nhiên",
    fact: "Salvia apiana (white sage) là cây bụi thơm bản địa miền nam California và Baja California. Hoa nhài đã được trồng để làm hương trong ít nhất 2.000 năm; tinh dầu hoa nhài và hoa hồng hiện vẫn được dùng trong nước hoa và mỹ phẩm.",
    chapters: [
      { label: "01 · Lớp nền", title: "Một màu xanh bạc trong nắng", body: "Cỏ cây đa sắc bắt đầu bằng nét xanh bạc của xô thơm — khô ráo, thảo mộc và có chút hoang dã. Nó tạo ra lớp nền tỉnh táo, giống cảm giác bước ra ngoài sau một cơn mưa: không khí sạch hơn, đường nét rõ hơn, mọi giác quan được đánh thức." },
      { label: "02 · Lớp giữa", title: "Hoa nhài bước vào lúc chạng vạng", body: "Hoa nhài không xuất hiện như một bó hoa đặt giữa phòng. Nó đến chậm, có độ ngọt và một chút bí ẩn, như mùi hương còn vương trên cổ tay sau một buổi tối dài. Hoa hồng nối tiếp bằng sắc mềm và ấm, đưa tổng thể từ thanh sạch sang gần gũi, từ khu vườn sang làn da." },
      { label: "03 · Dư âm", title: "Lãng mạn là một chuyển động", body: "Sự lãng mạn của mùi hương này không nằm ở việc làm mọi thứ trở nên hoàn hảo. Nó nằm trong chuyển động giữa các nốt: xô thơm giữ đôi chân trên mặt đất, hoa nhài làm câu chuyện mở ra, hoa hồng để lại một dư âm khiến ta muốn quay lại gần hơn." },
    ],
    sourceLabel: "USDA Forest Service · Kew Gardens",
    sourceUrl: "https://research.fs.usda.gov/treesearch/57258",
  },
  {
    slug: "rung-mua-truong-son",
    title: "Rừng mưa Trường Sơn",
    product: "Cỏ cây bản địa Việt Nam",
    detail: "Một câu chuyện về mùi hương đã cũ",
    description: "Những thân cây ẩm, lá xanh và đất sau mưa gợi lại mùi hương thân thuộc của một khu rừng đã ở đó từ rất lâu.",
    route: "Annamites · Việt Nam · Rừng thường xanh nhiệt đới",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85",
    imageAlt: "Rừng xanh sâu và ánh sáng lọc qua tán cây",
    fact: "Vùng Central Annamites thuộc dãy Trường Sơn gồm rừng thường xanh nhiệt đới và cận nhiệt đới, là một trong những vùng rừng liền mạch lớn cuối cùng ở lục địa châu Á và có nhiều loài quý hiếm, đặc hữu.",
    chapters: [
      { label: "01 · Địa hình", title: "Nơi những đám mây mắc lại trên sườn núi", body: "Trường Sơn không phải một khu rừng duy nhất, mà là một dải địa hình kéo dài với sườn núi, thung lũng, suối và những mảng rừng thay đổi theo độ cao. Mưa đến, đi qua tán lá rồi lưu lại trong đất. Cây cối ở đây sống cùng nước, cùng bóng râm và cùng nhịp thở dày của rừng." },
      { label: "02 · Sự sống", title: "Một mùi hương có nhiều giọng nói", body: "Cỏ cây bản địa Việt Nam không cố gắng tạo ra một nốt hương đơn độc. Nó gợi cả một hệ sinh thái: vỏ cây ẩm, lá non bị vò nhẹ, rêu trên đá và nhựa cây còn ấm dưới nắng. Mỗi lớp xuất hiện một chút, rồi rút lui để nhường chỗ cho lớp tiếp theo — giống hệt cách khu rừng tự kể chuyện." },
      { label: "03 · Ký ức", title: "Mùi hương đã cũ, nhưng không hề đứng yên", body: "Có những mùi hương không đưa ta đến một địa điểm cụ thể. Chúng đưa ta về một thời điểm: con đường đất sau mưa, căn bếp có cửa sổ mở, bàn tay ai đó chạm vào thân cây. Rừng mưa Trường Sơn là một lời nhắc dịu dàng rằng ký ức cũng có thể mọc lại, nếu ta đủ chậm để nhận ra." },
    ],
    sourceLabel: "WWF · Central Annamites, Viet Nam",
    sourceUrl: "https://www.worldwildlife.org/our-work/forests/the-nature-based-solutions-origination-platform/central-annamites-viet-nam/",
  },
  {
    slug: "not-tram",
    title: "Nốt trầm",
    product: "Lọ hương mini mang theo và các túi thơm",
    detail: "Một câu chuyện về sự sáng tạo và cá tính",
    description: "Những nốt hương nhỏ để mang theo bên mình, đặt vào ngăn kéo hay giữ lại một góc riêng trong căn phòng.",
    route: "Lọ hương mini · Túi thơm · Hương gỗ trầm",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1800&q=85",
    imageAlt: "Lọ hương và ánh nến trong một không gian tĩnh",
    fact: "Mùi hương được tạo nên bởi các hợp chất dễ bay hơi do thực vật phát ra; với hoa, những mùi hương ngọt thường góp phần thu hút các loài thụ phấn. Lọ mini và túi thơm là cách gói trải nghiệm ấy thành những khoảng hương nhỏ, dễ mang theo.",
    chapters: [
      { label: "01 · Thu nhỏ", title: "Một căn phòng vừa đủ trong lòng bàn tay", body: "Nốt trầm bắt đầu từ một ý tưởng đơn giản: mùi hương không nhất thiết phải chiếm cả căn phòng. Một lọ mini nằm trong túi áo, một túi thơm nép trong ngăn kéo, một dấu vết rất riêng trên chiếc khăn — những vật phẩm nhỏ tạo nên những vùng riêng tư mà chỉ bạn biết cách bước vào." },
      { label: "02 · Mang theo", title: "Hương thơm của những chuyển động", body: "Khi được mang theo, mùi hương trở thành một phần của lịch trình. Nó xuất hiện trước một cuộc gặp, trong chuyến tàu về nhà, giữa giờ làm việc hoặc khi cần một điểm tựa để bắt đầu lại. Không phô trương, không đòi hỏi sự chú ý — chỉ lặng lẽ nhắc rằng cá tính cũng có thể được thể hiện bằng một điều rất nhỏ." },
      { label: "03 · Tự chọn", title: "Sáng tạo là quyền được đổi khác", body: "Nốt trầm dành cho những người không muốn bị cố định bởi một mùi hương duy nhất. Hôm nay là gỗ ấm và khói sâu; ngày mai có thể là một nốt xanh, một chút hoa hoặc mùi vải sạch. Mỗi cách đặt, mỗi nơi mang theo, mỗi lần mở nắp đều tạo ra một phiên bản khác của cùng một câu chuyện." },
    ],
    sourceLabel: "Kew Gardens · Why do plants smell?",
    sourceUrl: "https://www.kew.org/read-and-watch/why-do-plants-smell",
  },
];
