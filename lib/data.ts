export interface ProductVariant {
  id: string;
  label: string;
  size?: string | null;
  color?: string | null;
  sku?: string | null;
  stock: number;
  available: boolean;
  price: number;
}

export interface Product {
  id: string;
  slug?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  soldCount?: number;
  createdAt?: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  notes: string;
  scentPyramid?: {
    top: string;
    middle: string;
    base: string;
  };
  origin: string;
  image: string;
  gallery: string[];
  videos?: string[];
  desc: string;
  detail: string;
  benefits: string[];
  usage: string;
  manageStock?: boolean;
  inStock?: boolean;
  variants?: ProductVariant[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Gỗ Palo Santo Nam Mỹ (Set 5 Thanh)',
    category: 'go-hoa-co',
    categoryName: 'Gỗ hoa cỏ',
    price: 180000,
    originalPrice: 220000,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Bán chạy nhất',
    notes: 'Gỗ thông cổ thụ, chanh vàng & bạc hà hoang dã',
    scentPyramid: {
      top: 'Chanh tươi, bạc hà sảng khoái',
      middle: 'Gỗ thông khô, nhựa cây ấm',
      base: 'Hương trầm sâu, đất sau mưa'
    },
    origin: 'Rừng khô Peru (Thu hái tự nhiên)',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Thanh gỗ thánh Holy Wood với tinh dầu cô đọng tự nhiên, xua tan năng lượng tù đọng và tái tạo sinh khí không gian.',
    detail: 'Được tuyển chọn từ những cây Palo Santo ngã đổ tự nhiên sau 4-10 năm tích tụ tinh dầu quý giá tại vùng rừng khô ven biển Peru. Hoàn toàn không tẩm ướp hương liệu tổng hợp.',
    benefits: ['Làm sạch trường năng lượng phòng', 'Giảm âu lo, giúp đầu óc minh mẫn', 'Xua đuổi côn trùng tự nhiên'],
    usage: 'Đốt nghiêng 45 độ trong 30 giây, thổi tắt lửa để khói bay tự do khắp phòng.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p1-v1', label: 'Set 5 thanh tiêu chuẩn', stock: 45, available: true, price: 180000 },
      { id: 'p1-v2', label: 'Set 10 thanh tiết kiệm', stock: 28, available: true, price: 330000 },
      { id: 'p1-v3', label: 'Hộp quà tặng kèm đế gốm', stock: 15, available: true, price: 420000 }
    ]
  },
  {
    id: 'p2',
    name: 'Bó Xô Thơm Trắng White Sage California',
    category: 'huong-thom',
    categoryName: 'Hương thơm',
    price: 210000,
    originalPrice: 250000,
    rating: 4.8,
    reviewsCount: 98,
    badge: 'Năng lượng cao',
    notes: 'Thảo mộc hoang dã, húng tây & vị thanh the',
    scentPyramid: {
      top: 'Thảo mộc tươi nồng nàn',
      middle: 'Lá xô thơm khô mộc mạc',
      base: 'Khói thuốc thảo mộc ấm áp'
    },
    origin: 'Vùng đồi California, Hoa Kỳ',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Bó thảo mộc thiêng cổ xưa dùng để đại thanh tẩy nhà mới, xua tan cảm giác nặng nề và thiết lập lại bình an.',
    detail: 'Lá xô thơm trắng lớn được hái thủ công, phơi khô tự nhiên dưới ánh mặt trời California và bó thủ công bằng sợi chỉ cotton 100%.',
    benefits: ['Thanh lọc sâu trường khí xung quanh', 'Hỗ trợ giải phóng cảm xúc tiêu cực', 'Tạo không gian thiền định thuần khiết'],
    usage: 'Hơ đầu bó trên ngọn lửa, di chuyển chậm rãi quanh các góc phòng rồi cắm vào khay gốm.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p2-v1', label: 'Bó tiêu chuẩn (10cm)', stock: 35, available: true, price: 210000 },
      { id: 'p2-v2', label: 'Bó lớn đại thanh tẩy (20cm)', stock: 20, available: true, price: 380000 }
    ]
  },
  {
    id: 'p3',
    name: 'Nến Thơm Sáp Đậu Nành "Rừng Sương Mù"',
    category: 'huong-thom',
    categoryName: 'Hương thơm',
    price: 350000,
    originalPrice: 420000,
    rating: 5.0,
    reviewsCount: 164,
    badge: 'Được yêu thích',
    notes: 'Gỗ thông tuyết tùng, rêu ẩm & hổ phách ấm',
    scentPyramid: {
      top: 'Sương sớm, rêu xanh ẩm',
      middle: 'Gỗ thông Đà Lạt, tuyết tùng',
      base: 'Hổ phách, sáp dừa ngọt nhẹ'
    },
    origin: 'Nghệ nhân Việt Nam chế tác thủ công',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Sáp đậu nành 100% tự nhiên với bấc gỗ nổ lách tách như đốm lửa trại, vỗ về giấc ngủ sau ngày dài bộn bề.',
    detail: 'Thời gian đốt liên tục hơn 45 giờ. Hũ thủy tinh tối màu bảo toàn trọn vẹn tinh dầu nguyên chất, tỏa hương dịu êm không khói đen.',
    benefits: ['Giúp thư giãn thần kinh, dễ vào giấc ngủ', 'Không khói độc hại, an toàn sức khỏe', 'Tạo điểm nhấn ánh sáng thi vị'],
    usage: 'Đốt tối thiểu 1 giờ trong lần đầu để bề mặt sáp tan đều. Cắt bớt bấc than trước mỗi lần thắp.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p3-v1', label: 'Hũ thủy tinh 200g (45h đốt)', stock: 50, available: true, price: 350000 },
      { id: 'p3-v2', label: 'Hũ gốm thô 380g (80h đốt)', stock: 22, available: true, price: 580000 }
    ]
  },
  {
    id: 'p4',
    name: 'Vòng Tay Gỗ Bách Xanh Tây Tạng (Hạt 10mm)',
    category: 'phu-kien',
    categoryName: 'Phụ kiện',
    price: 450000,
    originalPrice: 550000,
    rating: 4.9,
    reviewsCount: 86,
    badge: 'Phiên bản thủ công',
    notes: 'Hương gỗ rừng già, trầm ngọt tự nhiên',
    scentPyramid: {
      top: 'Mùi gỗ già mộc mạc',
      middle: 'Hương nhựa bách xanh tinh tế',
      base: 'Linh khí núi cao ấm áp'
    },
    origin: 'Tây Tạng (Gỗ bách xanh tự nhiên)',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Hạt gỗ bách xanh tự nhiên tích tụ linh khí cao nguyên, tỏa hương dịu khi ma sát trên cổ tay, nhắc nhở hơi thở chánh niệm.',
    detail: 'Từng hạt gỗ được tiện và đánh bóng thủ công không sơn phủ. Càng đeo theo thời gian thì hạt càng lên nước bóng mịn sẫm màu tuyệt đẹp.',
    benefits: ['Giữ tâm định và giảm xao nhãng', 'Hương gỗ tự nhiên dịu nhẹ bên người', 'Vật phẩm trợ duyên cho người thực hành thiền'],
    usage: 'Đeo hàng ngày ở tay trái hoặc lần chuỗi trong các giờ hít thở tĩnh lặng.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p4-v1', label: 'Hạt 8mm (Cổ tay 14-16cm)', stock: 30, available: true, price: 420000 },
      { id: 'p4-v2', label: 'Hạt 10mm (Cổ tay 16-18cm)', stock: 25, available: true, price: 450000 },
      { id: 'p4-v3', label: 'Chuỗi 108 hạt niệm thiền (6mm)', stock: 12, available: true, price: 790000 }
    ]
  },
  {
    id: 'p5',
    name: 'Nhang Trầm Hương Tự Nhiên Không Tăm (50 Nén)',
    category: 'go-hoa-co',
    categoryName: 'Gỗ hoa cỏ',
    price: 290000,
    originalPrice: 340000,
    rating: 5.0,
    reviewsCount: 112,
    badge: 'Trầm loại 1',
    notes: 'Trầm hương ngọt sâu, thoảng hương mật ong hoa rừng',
    scentPyramid: {
      top: 'Khói dịu, the mát nhẹ',
      middle: 'Trầm hương chín ngọt ngào',
      base: 'Gỗ quý lưu hương bền bỉ'
    },
    origin: 'Xứ Trầm Quảng Nam, Việt Nam',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: '100% bột trầm kiến tự nhiên ép cùng keo bời lời, làn khói mảnh mai như sợi chỉ tơ đưa không gian vào trạng thái thiền.',
    detail: 'Hộp gỗ mộc mạc chứa 50 nén nhang không tăm cùng 1 đế cắm gốm mini. Thời gian cháy 25-30 phút/nén, lưu hương tới 4 giờ trong phòng kín.',
    benefits: ['Thanh tịnh không gian đọc sách, uống trà', 'Định tâm an thần sâu', 'Không cay mắt, không độc hại'],
    usage: 'Cắm thẳng vào đế gốm hoặc rải nằm ngang trên đệm chống cháy.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p5-v1', label: 'Hộp 50 nén (Kèm đế gốm mini)', stock: 60, available: true, price: 290000 },
      { id: 'p5-v2', label: 'Hộp 100 nén tiết kiệm', stock: 40, available: true, price: 520000 }
    ]
  },
  {
    id: 'p6',
    name: 'Khay Gốm Thô Hỏa Biến Men Tro',
    category: 'dat-va-da',
    categoryName: 'Đất và Đá',
    price: 220000,
    originalPrice: 260000,
    rating: 4.8,
    reviewsCount: 73,
    badge: 'Độc bản thủ công',
    notes: 'Đất sét Bát Tràng nung củi nhiệt cao',
    scentPyramid: {
      top: 'Chất đất mộc thô nhám',
      middle: 'Men tro tự nhiên chuyển màu',
      base: 'Độ bền chịu nhiệt vĩnh cửu'
    },
    origin: 'Làng gốm cổ Bát Tràng',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Khay đĩa gốm thủ công mộc mạc men hỏa biến tối màu, điểm tựa vững chãi để đốt Palo Santo, xô thơm và nhang vòng an toàn.',
    detail: 'Nung ở nhiệt độ 1280°C đảm bảo chịu nhiệt tuyệt đối. Bề mặt nhám thô giữ trọn chất tự nhiên của đất và tro củi.',
    benefits: ['Cách nhiệt và hứng tàn tro sạch sẽ', 'Vật phẩm trang trí bàn trà tinh tế', 'Mỗi chiếc có vân men độc bản không trùng lặp'],
    usage: 'Dùng đựng than, đặt thanh gỗ Palo Santo hoặc nhang trầm đang cháy.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p6-v1', label: 'Khay tròn men tro (Đường kính 12cm)', stock: 32, available: true, price: 220000 },
      { id: 'p6-v2', label: 'Khay bầu dục hỏa biến (Dài 18cm)', stock: 18, available: true, price: 280000 }
    ]
  },
  {
    id: 'p7',
    name: 'Đèn Xông Gỗ Mộc Khắc Tay Nghệ Nhân "Thiền Viên"',
    category: 'sang-tao',
    categoryName: 'Sáng tạo',
    price: 480000,
    originalPrice: 560000,
    rating: 4.9,
    reviewsCount: 52,
    badge: 'Độc bản thủ công',
    notes: 'Gỗ tần bì nguyên khối, ánh sáng vàng ấm',
    scentPyramid: {
      top: 'Ánh sáng êm dịu vỗ về',
      middle: 'Gỗ mộc ấm áp khuếch tán',
      base: 'Tĩnh lặng thuần khiết'
    },
    origin: 'Xưởng mộc thủ công Hà Nội',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Đèn xông tinh dầu chế tác thủ công từ thân gỗ mộc tự nhiên, lan tỏa hương thơm dịu nhẹ cùng ánh sáng ấm áp cho bàn trà.',
    detail: 'Chạm khắc tỉ mỉ từng chi tiết bởi nghệ nhân lâu năm. Khay đốt hợp kim cách nhiệt an toàn tuyệt đối.',
    benefits: ['Khuếch tán tinh dầu tự nhiên đều khắp phòng', 'Ánh đèn ngủ thư thái dễ chịu', 'Tác phẩm trang trí mang đậm tính nghệ thuật'],
    usage: 'Nhỏ 3-5 giọt tinh dầu lên khay chứa nước ấm, bật đèn hoặc thắp nến tealight bên dưới.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p7-v1', label: 'Bản gỗ tần bì sáng', stock: 18, available: true, price: 480000 },
      { id: 'p7-v2', label: 'Bản gỗ óc chó sẫm màu', stock: 12, available: true, price: 560000 }
    ]
  },
  {
    id: 'p8',
    name: 'Hộp Quà Tặng Mộc Hương An Yên (Set Gift Box Cao Cấp)',
    category: 'qua-tang',
    categoryName: 'Quà tặng',
    price: 680000,
    originalPrice: 790000,
    rating: 5.0,
    reviewsCount: 89,
    badge: 'Quà tặng trang nhã',
    notes: 'Trọn bộ Palo Santo, nến thơm & khay gốm',
    scentPyramid: {
      top: 'Thanh khiết khởi đầu ngày mới',
      middle: 'Gỗ thông trầm ấm an yên',
      base: 'Gắn kết yêu thương vẹn tròn'
    },
    origin: 'RUNGU Tuyển chọn đóng gói thủ công',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=85&w=1400',
    gallery: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=85&w=1400',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=85&w=1400'
    ],
    desc: 'Hộp quà gói ghém tình thân với đầy đủ vật phẩm thanh tẩy và vỗ về tâm hồn: Palo Santo, nến thơm sáp tự nhiên và đế gốm mộc.',
    detail: 'Hộp giấy mỹ thuật thân thiện môi trường, thắt dây cói tự nhiên kèm thiệp viết tay mộc mạc.',
    benefits: ['Món quà ý nghĩa tặng người trân quý', 'Đầy đủ trọn bộ nghi thức sử dụng ngay', 'Thiết kế tinh tế sang trọng'],
    usage: 'Tặng kèm cẩm nang hướng dẫn các nghi thức mùi hương chi tiết bên trong hộp.',
    manageStock: true,
    inStock: true,
    variants: [
      { id: 'p8-v1', label: 'Set Mộc Nhiên (Palo Santo + Đế gốm + Nến 100g)', stock: 25, available: true, price: 680000 },
      { id: 'p8-v2', label: 'Set Đại Viên Mãn (Palo Santo + Xô thơm + Nến 200g + Khay men tro)', stock: 15, available: true, price: 950000 }
    ]
  }
];

export const TESTIMONIALS = [
  {
    quote: "Làn khói Palo Santo thanh thoát giúp góc làm việc của mình như được tái tạo năng lượng mỗi sáng. Cảm giác như vừa bước vào một khu rừng sau cơn mưa.",
    author: "An Nhiên",
    role: "Kiến Trúc Sư / Hà Nội",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    product: "Gỗ Palo Santo Nam Mỹ"
  },
  {
    quote: "Nến 'Rừng Sương Mù' tỏa hương gỗ rất êm dịu, tiếng bấc gỗ nổ lách tách như ngồi bên lò sưởi. Thắp 15 phút trước khi ngủ giúp mình dịu hẳn những muộn phiền.",
    author: "Lê Minh",
    role: "Nhà Sáng Tạo Nội Dung / TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    product: "Nến Thơm Rừng Sương Mù"
  },
  {
    quote: "Thiết kế đóng gói thô mộc nhưng cực kỳ chỉn chu và trân trọng. Vòng tay bách xanh càng đeo càng thơm nhẹ, nhắc nhở mình thở chậm lại giữa những áp lực.",
    author: "Thảo Nguyên",
    role: "Giáo Viên Yoga & Thiền / Đà Lạt",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    product: "Vòng Tay Gỗ Bách Xanh"
  }
];
