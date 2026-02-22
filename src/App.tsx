/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  BookOpen, 
  PenLine, 
  Heart, 
  History as HistoryIcon, 
  ChevronRight, 
  CheckCircle2,
  Coffee,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

// --- Data ---
const HISTORICAL_EVENTS = [
  { id: 1, date: '02-21', year: '1848', title: '《共產黨宣言》於倫敦發表', description: '卡爾·馬克思和弗里德里希·恩格斯受共產主義者同盟委託，在倫敦發表了這部影響深遠的政治文獻。它不僅定義了階級鬥爭的歷史觀，更深刻地改變了20世紀的全球地緣政治格局，引發了無數次的革命與社會變革。', category: '政治' },
  { id: 2, date: '02-22', year: '1732', title: '美國國父喬治·華盛頓誕生', description: '喬治·華盛頓出生於維吉尼亞州。作為大陸軍總司令帶領美國贏得獨立戰爭，並成為美國首任總統。他拒絕成為君主，堅持和平移交權力，為現代民主制度樹立了崇高的典範，被尊稱為「美國之父」。', category: '人物' },
  { id: 3, date: '02-23', year: '1945', title: '硫磺島戰役：摺鉢山上的星條旗', description: '在慘烈的硫磺島戰役中，五名美國海軍陸戰隊員與一名海軍醫護兵在摺鉢山頂插上星條旗。攝影師喬·羅森塔爾捕捉到的這一瞬間，成為二戰中最具象徵意義的影像，激勵了當時疲憊不堪的美國國民與前線士兵。', category: '戰爭' },
  { id: 4, date: '02-24', year: '1582', title: '格列高利曆頒布：現代曆法的誕生', description: '教宗格列高利十三世頒布曆法改革，修正了儒略曆中每年約11分鐘的誤差。這次改革跳過了10天時間，雖然最初僅在天主教國家實行，但最終成為現今全球通用的公曆標準，統一了人類對時間的度量。', category: '科學' },
  { id: 5, date: '02-25', year: '1964', title: '穆罕默德·阿里首次奪得拳王寶座', description: '22歲的卡修斯·克萊（後改名阿里）在邁阿密擊敗了被認為不可戰勝的索尼·利斯頓。他在賽後高喊「我是最偉大的！」，這不僅是體育史上的奇蹟，更標誌著一位將體育、政治與民權運動緊密結合的傳奇人物的崛起。', category: '體育' },
  { id: 6, date: '02-26', year: '1815', title: '拿破崙逃離厄爾巴島：百日王朝序幕', description: '被流放的拿破崙·波拿巴率領少數追隨者逃離厄爾巴島，在法國登陸後迅速重組軍隊。這開啟了著名的「百日王朝」時期，雖然最終在滑鐵盧戰敗，但其展現的個人魅力與對歐洲秩序的衝擊依然震撼歷史。', category: '政治' },
  { id: 7, date: '02-27', year: '1933', title: '國會縱火案：納粹奪權的轉折點', description: '德國柏林的國會大廈發生火災。納粹黨指責共產黨人縱火，希特勒藉此誘使總統興登堡簽署緊急法令，廢除基本公民權利並大肆逮捕反對派。這場火災成為德國從民主走向獨裁統治的關鍵導火索。', category: '政治' },
  { id: 8, date: '02-28', year: '1947', title: '二二八事件：台灣現代史的傷痕', description: '因查緝私菸引發的衝突，演變為全台規模的民眾抗爭與隨後的軍事鎮壓。此事件對台灣政治發展、族群關係產生了極其深遠的影響，是台灣走向民主化過程中必須面對與反思的重要歷史轉折點。', category: '政治' },
  { id: 9, date: '03-01', year: '1919', title: '三一運動：朝鮮獨立的吶喊', description: '受威爾遜「民族自決」影響，朝鮮半島爆發大規模反抗日本殖民統治的獨立運動。雖然遭到殘酷鎮壓，但它凝聚了民族意識，促成了大韓民國臨時政府的成立，是朝鮮現代民族主義運動的基石。', category: '政治' },
  { id: 10, date: '03-02', year: '1969', title: '協和式客機首飛：超音速時代的夢想', description: '英法聯合研發的協和號超音速客機在圖盧茲成功首飛。它能以兩倍音速飛行，將倫敦到紐約的航程縮短至3.5小時。儘管因高成本與噪音問題最終退役，它仍是航空工程史上的巅峰傑作。', category: '科技' },
  { id: 11, date: '03-03', year: '1875', title: '歌劇《卡門》巴黎首演', description: '喬治·比才的傑作《卡門》在巴黎喜歌劇院首演。最初因其寫實的風格與叛逆的女主角形象而備受爭議，但隨後成為全球演出頻率最高的歌劇之一，其充滿西班牙風情的旋律早已深入人心。', category: '藝術' },
  { id: 12, date: '03-04', year: '1861', title: '林肯就任總統：分裂國家的守護者', description: '亞伯拉罕·林肯在美國內戰爆發前夕就任第16任總統。他在就職演說中呼籲團結，但隨後仍不得不帶領北方投入慘烈的南北戰爭。他最終廢除了奴隸制，保存了聯邦，被公認為美國歷史上最偉大的總統之一。', category: '政治' },
  { id: 13, date: '03-05', year: '1946', title: '邱吉爾發表「鐵幕」演說', description: '溫斯頓·邱吉爾在美國密蘇里州富爾頓發表著名的演說，指出「一幅鐵幕已在歐洲大陸降下」。這場演說公開揭示了西方盟友與蘇聯之間的裂痕，被視為冷戰時期意識形態對抗正式開始的標誌。', category: '政治' },
  { id: 14, date: '03-06', year: '1869', title: '門得列夫發表元素週期表', description: '俄國化學家門得列夫向世界展示了第一份元素週期表。他不僅排列了已知元素，更驚人地預測了尚未發現元素的性質。這項發現為現代化學建立了秩序，是人類理解物質世界結構的重大里程碑。', category: '科學' },
  { id: 15, date: '03-07', year: '1876', title: '貝爾獲得電話專利：通訊革命的起點', description: '亞歷山大·格拉漢姆·貝爾獲得了發明電話的專利權。幾天後，他對著話筒說出了著名的「華生先生，快過來，我要見你」。這項發明徹底打破了空間的限制，開啟了人類即時語音通訊的新紀元。', category: '科技' },
  { id: 16, date: '01-01', year: '1901', title: '澳洲聯邦成立：南半球的新興國家', description: '原本分散的六個英國殖民地正式聯合，組成澳洲聯邦。這標誌著澳洲從殖民地走向自治領，並最終成為一個獨立主權國家的重要一步，確立了其在亞太地區獨特的政治與文化地位。', category: '政治' },
  { id: 17, date: '05-04', year: '1919', title: '五四運動：中國現代化的覺醒', description: '北京學生因不滿巴黎和會對山東問題的處理而發起示威。這場運動迅速擴大為全國性的愛國運動，並引發了深刻的思想文化變革（新文化運動），推動了中國現代民族主義與科學民主思想的傳播。', category: '文化' },
  { id: 18, date: '07-20', year: '1969', title: '阿波羅11號登月：人類的一大步', description: '尼爾·阿姆斯壯踏上月球表面，並說出：「這是個人的一小步，卻是人類的一大步。」這次任務實現了人類千百年來的登月夢想，展現了科技的極致可能，也象徵著人類探索宇宙新紀元的開啟。', category: '科學' },
  { id: 19, date: '11-09', year: '1989', title: '柏林圍牆倒塌：冷戰終結的象徵', description: '分隔東西柏林28年的圍牆在民眾的歡呼聲中被推倒。這一歷史性時刻不僅象徵著德國統一的開始，也預示著東歐劇變與蘇聯解體，標誌著長達半個世紀的冷戰對峙走向終結。', category: '政治' },
  { id: 20, date: '12-17', year: '1903', title: '萊特兄弟首飛：征服天空的開端', description: '奧維爾·萊特在北卡羅來納州駕駛「飛行者一號」完成了人類首次受控動力飛行。雖然飛行時間僅12秒，距離僅36公尺，但它證明了重於空氣的飛行器可以載人飛行，徹底改變了人類的交通與戰爭模式。', category: '科技' },
  { id: 21, date: '04-15', year: '1912', title: '泰坦尼克號沉沒：永不沉沒的神話破滅', description: '當時世界上最大的豪華客輪泰坦尼克號在從南安普敦開往紐約的首航中撞上冰山。這場災難導致1500多人遇難，引發了全球對航海安全規定的徹底改革，也成為人類面對自然力量時傲慢代價的永恆警示。', category: '災難' },
  { id: 22, date: '06-06', year: '1944', title: '諾曼第登陸：D-Day 歐洲解放的開始', description: '盟軍在法國諾曼第海岸發動了史上最大規模的海上入侵行動。數以萬計的士兵在猛烈砲火下衝上沙灘，開啟了歐洲第二戰場。這次行動的成功直接導致了納粹德國的最終崩潰，是二戰最關鍵的轉折點之一。', category: '戰爭' },
  { id: 23, date: '08-06', year: '1945', title: '廣島原子彈爆炸：核子時代的殘酷黎明', description: '美國在日本廣島投下了代號為「小男孩」的原子彈，瞬間摧毀了整座城市。這是人類首次將核武器用於戰爭，其巨大的破壞力與長期的輻射影響，迫使人類重新思考戰爭的本質與核能的道德邊界。', category: '戰爭' },
  { id: 24, date: '10-24', year: '1945', title: '聯合國正式成立：戰後和平的基石', description: '《聯合國憲章》正式生效，聯合國取代了失敗的國際聯盟。其宗旨是維護國際和平與安全，促進各國間的友好關係。儘管面臨重重挑戰，它仍是當今世界最重要的多邊外交平台與人道主義援助支柱。', category: '政治' },
  { id: 25, date: '05-29', year: '1953', title: '人類首次登上珠峰：地球之巔的征服', description: '紐西蘭探險家艾德蒙·希拉里與雪巴人丹增·諾蓋成功登頂海拔8848公尺的珠穆朗瑪峰。這次壯舉展現了人類不畏艱險、挑戰極限的精神，激勵了無數後來的登山者去探索地球上最荒涼與神聖的角落。', category: '探險' },
  { id: 26, date: '10-12', year: '1492', title: '哥倫布到達美洲：兩個世界的碰撞', description: '哥倫布率領三艘帆船橫跨大西洋，到達了巴哈馬群島。他誤以為到達了印度，但實際上開啟了歐洲與美洲之間大規模的文化、生物與人口交換。這場碰撞深刻改變了全球生態，也開啟了殘酷的殖民時代。', category: '探險' },
  { id: 27, date: '07-14', year: '1789', title: '攻佔巴士底監獄：法國大革命爆發', description: '憤怒的巴黎民眾攻佔了象徵王權壓迫的巴士底監獄。這一行動不僅釋放了囚犯，更點燃了追求「自由、平等、博愛」的革命之火，最終推翻了君主專制，對現代民主政治與人權觀念產生了決定性影響。', category: '政治' },
  { id: 28, date: '01-27', year: '1945', title: '奧斯威辛集中營解放：人類文明的至暗時刻', description: '蘇聯軍隊解放了納粹德國最大的滅絕營。在那裡，超過一百萬人被有組織地屠殺。這一天的紀念提醒著世人，仇恨與偏見可能導致的極端後果，並確立了「永不重演」的國際共識。', category: '人權' },
  { id: 29, date: '03-15', year: '前44', title: '凱撒遇刺：羅馬共和國的終結', description: '尤利烏斯·凱撒在元老院會議中被布魯圖斯等密謀者刺殺。密謀者試圖挽救共和國，但卻引發了長期的內戰，最終導致了羅馬帝國的誕生。凱撒之死成為歷史上最具戲劇性的政治謀殺案。', category: '政治' },
  { id: 30, date: '08-28', year: '1963', title: '「我有一個夢想」：民權運動的巔峰', description: '馬丁·路德·金恩在華盛頓大遊行中發表了震撼人心的演說。他呼籲終結種族歧視，追求一個以品格而非膚色評判人的社會。這場演說直接推動了美國民權法案的通過，成為人類追求平等權利的永恆宣言。', category: '人權' },
  { id: 31, date: '11-22', year: '1963', title: '甘迺迪遇刺：震驚世界的達拉斯槍聲', description: '美國第35任總統約翰·甘迺迪在達拉斯街頭遇刺身亡。這位年輕、充滿希望的領導人之死，引發了無數陰謀論，也讓美國陷入了長期的社會動盪與集體創傷，標誌著一個純真時代的終結。', category: '政治' },
  { id: 32, date: '02-11', year: '1990', title: '曼德拉獲釋：南非種族隔離的終結', description: '在被囚禁27年後，納爾遜·曼德拉走出監獄。他沒有選擇報復，而是倡導和解與重建。他的獲釋標誌著南非種族隔離制度的瓦解，他也因此成為全球公認的勇氣、寬恕與民主的象徵。', category: '人權' },
  { id: 33, date: '04-12', year: '1961', title: '加加林進入太空：人類飛向星辰', description: '蘇聯太空人尤里·加加林乘坐「東方一號」飛船，完成了人類首次繞地飛行。他在太空中感嘆「地球是藍色的，多麼美妙」。這次飛行開啟了人類的太空時代，徹底改變了我們對自身在宇宙中位置的認知。', category: '科技' },
  { id: 34, date: '05-08', year: '1945', title: '二戰歐洲戰場勝利：黑暗的終結', description: '納粹德國正式簽署無條件投降書。在經歷了六年的慘烈戰爭、數千萬人喪生後，歐洲終於迎來了和平。人們在倫敦、巴黎與莫斯科的街頭狂歡，慶祝法西斯主義的覆滅與自由的重生。', category: '戰爭' },
  { id: 35, date: '09-11', year: '2001', title: '九一一襲擊事件：改變世界的恐怖陰影', description: '恐怖分子劫持民航客機撞擊紐約世貿中心與五角大廈。這場襲擊造成近三千人死亡，引發了全球性的「反恐戰爭」，深刻改變了國際安全格局、航空旅行方式以及西方社會對多元文化的看法。', category: '災難' },
  { id: 36, date: '12-25', year: '800', title: '查理曼加冕：神聖羅馬帝國的雛形', description: '教宗利奧三世在聖伯多祿大殿為查理曼加冕。這標誌著西歐在羅馬帝國滅亡數百年後，再次出現了一個強大的統一政權，確立了中世紀歐洲政教合一的權力結構，查理曼也被譽為「歐洲之父」。', category: '政治' },
  { id: 37, date: '01-15', year: '1929', title: '馬丁·路德·金恩誕生：非暴力抗爭的導師', description: '這位未來的諾貝爾和平獎得主出生於亞特蘭大。他深受甘地思想影響，堅持以非暴力方式爭取非裔美國人的公民權利。他的勇氣與智慧，讓無數受壓迫者看到了透過和平手段改變社會的希望。', category: '人物' },
  { id: 38, date: '03-08', year: '1917', title: '俄國二月革命：羅曼諾夫王朝的覆滅', description: '因戰爭與飢荒引發的婦女示威演變為全城暴動。沙皇尼古拉二世被迫退位，結束了統治俄國三百年的羅曼諾夫王朝。這場革命為隨後的十月革命與蘇聯的建立鋪平了道路，徹底改變了俄國的命運。', category: '政治' },
  { id: 39, date: '06-28', year: '1914', title: '薩拉熱窩事件：引爆世界大戰的火星', description: '塞爾維亞民族主義者刺殺了奧匈帝國皇儲斐迪南大公。這場看似局部的暗殺，因錯綜複雜的盟約體系迅速升級，引發了第一次世界大戰，導致四大帝國崩潰，重新繪製了世界地圖。', category: '戰爭' },
  { id: 40, date: '07-04', year: '1776', title: '美國《獨立宣言》：天賦人權的宣告', description: '大陸會議正式通過由傑佛遜起草的宣言，宣告北美十三州脫離英國統治。宣言中「人人生而平等」的理念，不僅是美國立國的基石，更成為全球追求自由與民主運動的靈魂。', category: '政治' },
  { id: 41, date: '08-15', year: '1945', title: '日本投降：第二次世界大戰正式結束', description: '昭和天皇透過廣播發表《終戰詔書》，宣佈接受波茨坦公告。這標誌著人類歷史上規模最大、傷亡最慘重的戰爭終於畫下句點，亞洲與太平洋地區也開始了艱難的戰後重建與去殖民化進程。', category: '戰爭' },
  { id: 42, date: '10-01', year: '1949', title: '中華人民共和國成立：東方巨龍的轉身', description: '毛澤東在天安門城樓宣佈新中國成立。這標誌著中國結束了長期的戰亂與半殖民地狀態，開啟了社會主義建設的新篇章，對冷戰時期的國際格局與亞洲地緣政治產生了極其深遠的影響。', category: '政治' },
  { id: 43, date: '11-11', year: '1918', title: '一戰停戰：壕溝戰火的平息', description: '協約國與德國在法國貢比涅森林的火車車廂內簽署停戰協定。長達四年的血腥壕溝戰終於結束，這一天後來成為許多國家的陣亡將士紀念日，提醒人們戰爭的殘酷與和平的珍貴。', category: '戰爭' },
  { id: 44, date: '12-10', year: '1948', title: '《世界人權宣言》：人類良知的里程碑', description: '聯合國大會通過了這份界定基本人權的文件。它宣告不論種族、性別、語言或宗教，每個人都享有與生俱來的尊嚴與權利。它是現代國際人權法的基礎，也是人類追求公正社會的共同標準。', category: '人權' },
  { id: 45, date: '01-30', year: '1948', title: '甘地遇刺：非暴力之魂的隕落', description: '印度獨立運動領袖聖雄甘地被一名激進分子暗殺。他一生倡導「真理與非暴力」，帶領印度脫離英國統治。他的死震驚了世界，但他的思想繼續激勵著全球各地的民權與自由運動。', category: '政治' },
  { id: 46, date: '02-04', year: '1945', title: '雅爾達會議：劃分戰後勢力範圍', description: '羅斯福、邱吉爾與史達林在克里米亞會晤，商討德國投降後的處理方案與聯合國的建立。這次會議實際上劃分了戰後歐洲的勢力範圍，為隨後的冷戰格局埋下了伏筆。', category: '政治' },
  { id: 47, date: '03-12', year: '1925', title: '孫中山逝世：革命尚未成功', description: '中國近代民主革命的先行者孫中山在北京病逝。他提出的「三民主義」深刻影響了中國的現代化進程。他臨終前留下的「革命尚未成功，同志仍須努力」成為激勵後人的名言。', category: '人物' },
  { id: 48, date: '04-18', year: '1906', title: '舊金山大地震：火海中的城市重建', description: '一場強烈地震襲擊舊金山，隨後引發的大火燃燒了三天三夜，摧毀了城市的大部分區域。這次災難促使了現代地震學的研究，也展現了城市在廢墟中迅速重建的驚人韌性。', category: '災難' },
  { id: 49, date: '05-20', year: '1927', title: '林白跨洋飛行：縮小世界的壯舉', description: '查爾斯·林白獨自駕駛「聖路易斯精神號」，從紐約飛抵巴黎，完成史上首次不著陸跨大西洋飛行。這次飛行讓林白成為全球偶像，也極大地推動了民用航空事業的飛速發展。', category: '科技' },
  { id: 50, date: '06-15', year: '1215', title: '《大憲章》簽署：法治精神的萌芽', description: '英王約翰在蘭尼米德草地簽署此文件。它限制了君主的絕對權力，確立了「法律高於王權」與「正當法律程序」的原則，成為後來英國憲政與美國憲法的精神源頭。', category: '政治' },
  { id: 51, date: '07-16', year: '1945', title: '三位一體核試驗：潘朵拉盒子的開啟', description: '人類歷史上首次原子彈爆炸實驗在美國新墨西哥州成功進行。奧本海默在目睹爆炸後想起了《薄伽梵歌》的名言：「現在我成了死神，世界的毀滅者。」人類從此掌握了足以毀滅文明的力量。', category: '科學' },
  { id: 52, date: '08-24', year: '79', title: '維蘇威火山爆發：被時間凝固的龐貝', description: '維蘇威火山突然噴發，厚厚的火山灰瞬間埋葬了繁榮的龐貝古城。數世紀後被挖掘出的遺址，為我們提供了關於羅馬帝國日常生活最完整、最震撼的視覺記錄。', category: '災難' },
  { id: 53, date: '09-01', year: '1939', title: '二戰爆發：全球浩劫的開始', description: '納粹德國閃擊波蘭，引發英法對德宣戰。這場人類歷史上規模最大的戰爭，波及全球大部分國家，導致了猶太人大屠殺、原子彈的使用，並最終徹底重塑了世界秩序。', category: '戰爭' },
  { id: 54, date: '10-14', year: '1066', title: '黑斯廷斯戰役：諾曼征服英格蘭', description: '諾曼第公爵威廉擊敗英格蘭國王哈羅德。這次征服徹底改變了英國的語言、法律、建築與社會結構，讓英國與歐洲大陸的文化產生了深度的融合，對西方歷史產生了長遠影響。', category: '戰爭' },
  { id: 55, date: '11-19', year: '1863', title: '蓋茨堡演說：民有、民治、民享', description: '林肯在蓋茨堡國家公墓揭幕式上發表了僅兩百多字的演說。他重新定義了美國內戰的意義，將其提升為對自由與民主理想的保衛戰，這篇演說成為人類政治史上最動人的篇章之一。', category: '政治' },
  { id: 56, date: '12-07', year: '1941', title: '珍珠港事件：覺醒的巨人', description: '日本海軍偷襲美國珍珠港基地，導致美軍慘重損失。這次襲擊終結了美國國內的孤立主義，迫使美國正式參加第二次世界大戰，將其龐大的工業實力轉化為戰爭機器，最終決定了戰爭的勝負。', category: '戰爭' },
  { id: 57, date: '01-20', year: '1961', title: '甘迺迪就職：新邊疆的召喚', description: '甘迺迪發表了充滿激情的演說，呼籲美國民眾承擔責任。他提出的「新邊疆」政策推動了太空競賽、民權運動與和平工作團的建立，激勵了一整代年輕人投身公共服務。', category: '政治' },
  { id: 58, date: '02-12', year: '1809', title: '達爾文誕生：演化論的奠基者', description: '查爾斯·達爾文出生於英國。他透過在小獵犬號上的考察，提出了「物競天擇，適者生存」的演化理論。這一理論徹底推翻了當時的生物觀，引發了科學與宗教界的巨大變革。', category: '人物' },
  { id: 59, date: '03-14', year: '1879', title: '愛因斯坦誕生：相對論的奇才', description: '阿爾伯特·愛因斯坦出生於德國。他提出的相對論重塑了我們對時間、空間、物質與能量的理解。他不僅是科學天才，更是和平主義者與人道主義的倡導者，成為現代科學的象徵。', category: '人物' },
  { id: 60, date: '04-26', year: '1986', title: '切爾諾貝利事故：核能的安全警鐘', description: '蘇聯切爾諾貝利核電站發生爆炸，釋放出大量放射性物質。這次事故導致了嚴重的環境災難與健康問題，也促使全球對核能安全進行深刻反思，並間接加速了蘇聯體制的崩潰。', category: '災難' },
];
// --- Types ---
type View = 'draw' | 'detail' | 'notes' | 'donate';

interface Note {
  eventId: number;
  date: string;
  content: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('draw');
  const [selectedEvent, setSelectedEvent] = useState<typeof HISTORICAL_EVENTS[0] | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [hasDrawnToday, setHasDrawnToday] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const savedNotes = localStorage.getItem('history_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    const lastDrawDate = localStorage.getItem('last_draw_date');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastDrawDate === today) {
      setHasDrawnToday(true);
      const lastEventId = localStorage.getItem('last_event_id');
      if (lastEventId) {
        const event = HISTORICAL_EVENTS.find(e => e.id === parseInt(lastEventId));
        if (event) setSelectedEvent(event);
      }
    }
  }, []);

  // --- Handlers ---
  const handleDraw = () => {
    // Logic: Pick an event based on the date to make it "daily"
    // Or just random for the demo, but let's use date-based seed
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % HISTORICAL_EVENTS.length;
    const event = HISTORICAL_EVENTS[index];

    setSelectedEvent(event);
    setHasDrawnToday(true);
    setCurrentView('detail');
    
    localStorage.setItem('last_draw_date', today.toISOString().split('T')[0]);
    localStorage.setItem('last_event_id', event.id.toString());
  };

  const saveNote = (content: string) => {
    if (!selectedEvent) return;
    const newNotes = { ...notes, [selectedEvent.id]: content };
    setNotes(newNotes);
    localStorage.setItem('history_notes', JSON.stringify(newNotes));
  };

  // --- Sub-components ---

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 px-6 py-3 flex justify-around items-center z-50">
      <button 
        onClick={() => setCurrentView('draw')}
        className={`flex flex-col items-center gap-1 ${currentView === 'draw' || currentView === 'detail' ? 'text-stone-900' : 'text-stone-400'}`}
      >
        <Calendar size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">今日</span>
      </button>
      <button 
        onClick={() => setCurrentView('notes')}
        className={`flex flex-col items-center gap-1 ${currentView === 'notes' ? 'text-stone-900' : 'text-stone-400'}`}
      >
        <PenLine size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">心得</span>
      </button>
      <button 
        onClick={() => setCurrentView('donate')}
        className={`flex flex-col items-center gap-1 ${currentView === 'donate' ? 'text-stone-900' : 'text-stone-400'}`}
      >
        <Heart size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">贊助</span>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 font-serif pb-24">
      {/* Header */}
      <header className="p-8 flex justify-between items-center border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-light tracking-tight">時光籤筒</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-sans">Daily History Oracle</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}</p>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-sans">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        <AnimatePresence mode="wait">
          {currentView === 'draw' && (
            <motion.div 
              key="draw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 gap-12"
            >
              <div className="relative">
                <div className="w-48 h-64 bg-stone-800 rounded-t-full border-4 border-stone-700 flex items-end justify-center pb-8 shadow-2xl overflow-hidden">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-stone-600 rounded-full"></div>
                  <div className="flex flex-col gap-2 items-center">
                    {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-2 h-24 bg-stone-300 rounded-full opacity-50"
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-100 px-6 py-2 rounded-full text-xs tracking-widest uppercase font-sans shadow-lg">
                  籤筒
                </div>
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-xl font-light italic">「歷史是過去與現在永無止境的對話」</h2>
                <p className="text-sm text-stone-500 max-w-[280px] mx-auto leading-relaxed">
                  點擊下方按鈕，抽取今日的歷史片段，開啟一段跨越時空的思考。
                </p>
              </div>

              <button 
                onClick={hasDrawnToday ? () => setCurrentView('detail') : handleDraw}
                className="group relative px-12 py-4 bg-stone-900 text-stone-100 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                <span className="relative z-10 font-sans text-sm tracking-[0.3em] uppercase">
                  {hasDrawnToday ? '查看今日歷史' : '抽取今日歷史'}
                </span>
                <div className="absolute inset-0 bg-stone-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </motion.div>
          )}

          {currentView === 'detail' && selectedEvent && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8 py-4"
            >
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <HistoryIcon size={120} />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-[10px] uppercase tracking-widest rounded-full font-sans">
                      {selectedEvent.category}
                    </span>
                    <span className="text-3xl font-light text-stone-300">#{selectedEvent.id}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-stone-400 font-sans text-sm tracking-widest uppercase">{selectedEvent.year}年 {selectedEvent.date}</p>
                    <h2 className="text-3xl font-medium leading-tight">{selectedEvent.title}</h2>
                  </div>

                  <div className="w-12 h-0.5 bg-stone-900"></div>

                  <p className="text-lg leading-relaxed text-stone-700 italic">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-sans px-2">寫下您的感悟</h3>
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100 space-y-4">
                  <textarea 
                    placeholder="今日的歷史帶給您什麼啟發？"
                    className="w-full h-32 bg-transparent border-none focus:ring-0 resize-none text-stone-700 placeholder:text-stone-300 leading-relaxed"
                    value={notes[selectedEvent.id] || ''}
                    onChange={(e) => saveNote(e.target.value)}
                  />
                  <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                    <span className="text-[10px] text-stone-400 font-sans flex items-center gap-1">
                      <CheckCircle2 size={12} /> 自動儲存至本地
                    </span>
                    <button 
                      onClick={() => setCurrentView('notes')}
                      className="text-xs font-sans font-medium text-stone-900 flex items-center gap-1 hover:underline"
                    >
                      查看所有心得 <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'notes' && (
            <motion.div 
              key="notes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="flex justify-between items-end px-2">
                <h2 className="text-2xl font-light">歷史筆記</h2>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">Your Reflections</p>
              </div>

              {Object.keys(notes).length === 0 ? (
                <div className="bg-white/50 border border-dashed border-stone-300 rounded-[24px] p-12 text-center space-y-4">
                  <PenLine size={32} className="mx-auto text-stone-300" />
                  <p className="text-stone-400 italic">尚未有任何筆記。抽取今日歷史並開始記錄吧。</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(notes).map(([id, content]) => {
                    const event = HISTORICAL_EVENTS.find(e => e.id === parseInt(id));
                    if (!event) return null;
                    return (
                      <div key={id} className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">{event.year} · {event.title}</span>
                          <button 
                            onClick={() => {
                              setSelectedEvent(event);
                              setCurrentView('detail');
                            }}
                            className="text-stone-300 hover:text-stone-900 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                        <p className="text-stone-700 leading-relaxed line-clamp-3">{content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'donate' && (
            <motion.div 
              key="donate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-4"
            >
              <div className="text-center space-y-4 py-8">
                <div className="w-20 h-20 bg-stone-900 text-stone-100 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Heart size={32} />
                </div>
                <h2 className="text-3xl font-light">支持時光籤筒</h2>
                <p className="text-stone-500 max-w-[280px] mx-auto leading-relaxed">
                  如果您喜歡這個小工具，歡迎透過贊助支持我們的持續運作。
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { amount: 'NT$ 30', label: '請喝杯茶', icon: <Coffee size={18} /> },
                  { amount: 'NT$ 150', label: '支持開發', icon: <BookOpen size={18} /> },
                  { amount: 'NT$ 500', label: '文化守護者', icon: <Heart size={18} /> }
                ].map((tier, idx) => (
                  <button 
                    key={idx}
                    className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100 flex justify-between items-center group hover:border-stone-900 transition-all"
                    onClick={() => alert(`感謝您的心意！這是一個模擬的 Google Play 贊助按鈕。\n金額：${tier.amount}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-stone-100 transition-colors">
                        {tier.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-sans font-semibold">{tier.amount}</p>
                        <p className="text-xs text-stone-400">{tier.label}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-stone-900 text-stone-100 rounded-full text-[10px] font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Donate
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-stone-100 rounded-[24px] text-center space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">Google Play 支付說明</p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  本應用程式目前為網頁預覽版。在正式發布的 Android 版本中，您將可以透過 Google Play 商店的安全支付系統進行贊助。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navigation />
    </div>
  );
}
