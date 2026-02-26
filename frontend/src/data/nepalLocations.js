/**
 * Nepal Administrative Divisions Data
 * 7 Provinces → 77 Districts → 753 Local Governments (Municipalities / Rural Municipalities)
 *
 * Legend:
 *   महानगरपालिका  = Metropolitan City
 *   उपमहानगरपालिका = Sub-Metropolitan City
 *   नगरपालिका     = Municipality
 *   गाउँपालिका    = Rural Municipality (Gaupalika)
 */

const NEPAL_LOCATIONS = {
  'Koshi Province': {
    'Bhojpur': [
      'Bhojpur Municipality', 'Shadanand Municipality', 'Tyamke Maiyunm Rural Municipality',
      'Arun Rural Municipality', 'Pauwadungma Rural Municipality', 'Salpasilichho Rural Municipality',
      'Aamchowk Rural Municipality', 'Hatuwagadhi Rural Municipality', 'Ramprasad Rai Rural Municipality',
    ],
    'Dhankuta': [
      'Dhankuta Municipality', 'Pakhribas Municipality', 'Mahalaxmi Municipality',
      'Sangurigadhi Rural Municipality', 'Chhathar Jorpati Rural Municipality',
      'Sahidbhumi Rural Municipality', 'Khalsa Chhintang Sahidbhumi Rural Municipality',
    ],
    'Ilam': [
      'Ilam Municipality', 'Deumai Municipality', 'Mai Municipality', 'Suryodaya Municipality',
      'Fakphokthum Rural Municipality', 'Mangsebung Rural Municipality', 'Chulachuli Rural Municipality',
      'Rong Rural Municipality', 'Mai Jogmai Rural Municipality', 'Sandakpur Rural Municipality',
    ],
    'Jhapa': [
      'Mechinagar Municipality', 'Bhadrapur Municipality', 'Birtamod Municipality',
      'Arjundhara Municipality', 'Kankai Municipality', 'Shivasatakshi Municipality',
      'Damak Municipality', 'Gauradaha Municipality', 'Buddhashanti Rural Municipality',
      'Haldibari Rural Municipality', 'Kachankawal Rural Municipality', 'Barhadashi Rural Municipality',
      'Jhapa Rural Municipality', 'Gaurigunj Rural Municipality', 'Kamal Rural Municipality',
    ],
    'Khotang': [
      'Diktel Rupakot Majhuwagadhi Municipality', 'Halesi Tuwachung Municipality',
      'Khotehang Rural Municipality', 'Diprung Chuichumma Rural Municipality',
      'Ainselukhark Rural Municipality', 'Rawa Besi Rural Municipality',
      'Kepilasagadhi Rural Municipality', 'Jantedhunga Rural Municipality',
      'Barahapokhari Rural Municipality', 'Sakela Rural Municipality',
    ],
    'Morang': [
      'Biratnagar Metropolitan City', 'Sundarharaicha Municipality', 'Belbari Municipality',
      'Pathari Shanishchare Municipality', 'Urlabari Municipality', 'Rangeli Municipality',
      'Letang Municipality', 'Ratuwamai Municipality', 'Sunwarshi Municipality',
      'Gramthan Rural Municipality', 'Kanepokhari Rural Municipality', 'Budhiganga Rural Municipality',
      'Kerabari Rural Municipality', 'Miklajung Rural Municipality', 'Jahada Rural Municipality',
      'Katahari Rural Municipality', 'Dhanpalthan Rural Municipality',
    ],
    'Okhaldhunga': [
      'Siddhicharan Municipality', 'Khijidemba Rural Municipality', 'Chisankhugadhi Rural Municipality',
      'Molung Rural Municipality', 'Likhu Rural Municipality', 'Champadevi Rural Municipality',
      'Sunkoshi Rural Municipality', 'Manebhanjyang Rural Municipality',
    ],
    'Panchthar': [
      'Phidim Municipality', 'Hilihang Rural Municipality', 'Kummayak Rural Municipality',
      'Falgunanda Rural Municipality', 'Tumbewa Rural Municipality', 'Miklajung Rural Municipality',
      'Yangwarak Rural Municipality', 'Phalelung Rural Municipality',
    ],
    'Sankhuwasabha': [
      'Khandbari Municipality', 'Chainpur Municipality', 'Dharmadevi Municipality',
      'Panchkhapan Municipality', 'Madi Municipality',
      'Makalu Rural Municipality', 'Silichong Rural Municipality', 'Bhotkhola Rural Municipality',
      'Sabhapokhari Rural Municipality', 'Chichila Rural Municipality',
    ],
    'Solukhumbu': [
      'Solududhkunda Municipality', 'Necha Salyan Rural Municipality',
      'Dudhkoshi Rural Municipality', 'Mahakulung Rural Municipality',
      'Sotang Rural Municipality', 'Thulung Dudhkoshi Rural Municipality',
      'Likhu Pike Rural Municipality', 'Khumbu Pasang Lhamu Rural Municipality',
    ],
    'Sunsari': [
      'Itahari Sub-Metropolitan City', 'Dharan Sub-Metropolitan City', 'Inaruwa Municipality',
      'Duhabi Municipality', 'Ramdhuni Municipality', 'Barahachhetra Municipality',
      'Koshi Rural Municipality', 'Gadhi Rural Municipality', 'Barju Rural Municipality',
      'Harinagar Rural Municipality', 'Dewanganj Rural Municipality', 'Bhokraha Narsingh Rural Municipality',
    ],
    'Taplejung': [
      'Phungling Municipality', 'Sidingba Rural Municipality', 'Meringden Rural Municipality',
      'Aathrai Triveni Rural Municipality', 'Maiwakhola Rural Municipality',
      'Phaktanglung Rural Municipality', 'Mikwakhola Rural Municipality',
      'Sirijangha Rural Municipality', 'Pathivara Yangwarak Rural Municipality',
    ],
    'Terhathum': [
      'Myanglung Municipality', 'Laligurans Municipality', 'Aathrai Rural Municipality',
      'Chhathar Rural Municipality', 'Phedap Rural Municipality', 'Menchayam Rural Municipality',
    ],
    'Udayapur': [
      'Triyuga Municipality', 'Katari Municipality', 'Chaudandigadhi Municipality',
      'Belaka Municipality', 'Udayapurgadhi Rural Municipality', 'Rautamai Rural Municipality',
      'Tapli Rural Municipality', 'Limchungbung Rural Municipality',
    ],
  },

  'Madhesh Province': {
    'Bara': [
      'Kalaiya Sub-Metropolitan City', 'Jeetpur Simara Sub-Metropolitan City',
      'Kolhabi Municipality', 'Nijgadh Municipality', 'Mahagadhimai Municipality',
      'Simraungadh Municipality', 'Pacharauta Municipality', 'Pheta Rural Municipality',
      'Bishrampur Rural Municipality', 'Prasauni Rural Municipality', 'Devtal Rural Municipality',
      'Suwarna Rural Municipality', 'Baragadhi Rural Municipality', 'Karaiyamai Rural Municipality',
      'Parwanipur Rural Municipality', 'Adarsha Kotwal Rural Municipality',
    ],
    'Dhanusha': [
      'Janakpurdham Sub-Metropolitan City', 'Chhireshwornath Municipality',
      'Ganeshman Charnath Municipality', 'Dhanusadham Municipality', 'Nagarain Municipality',
      'Bideha Municipality', 'Mithila Municipality', 'Sahidnagar Municipality',
      'Sabaila Municipality', 'Kamala Municipality', 'Hansapur Municipality',
      'Janaknandini Rural Municipality', 'Bateshwar Rural Municipality',
      'Mithila Bihari Municipality', 'Lakshminiya Rural Municipality',
      'Mukhiyapatti Musaharmiya Rural Municipality', 'Aaurahi Rural Municipality',
      'Dhanauji Rural Municipality',
    ],
    'Mahottari': [
      'Jaleshwar Municipality', 'Bardibas Municipality', 'Gaushala Municipality',
      'Loharpatti Municipality', 'Ramgopalpur Municipality', 'Aurahi Municipality',
      'Balwa Municipality', 'Manra Siswa Municipality', 'Matihani Municipality',
      'Bhangaha Municipality', 'Ekdara Rural Municipality', 'Samsi Rural Municipality',
      'Sonama Rural Municipality', 'Pipra Rural Municipality', 'Mahottari Rural Municipality',
    ],
    'Parsa': [
      'Birgunj Metropolitan City', 'Pokhariya Municipality', 'Bahudarmai Municipality',
      'Parsagadhi Municipality', 'Bindabasini Rural Municipality', 'Dhobini Rural Municipality',
      'Chhipaharmai Rural Municipality', 'Jagarnathpur Rural Municipality',
      'Kalikamai Rural Municipality', 'Paterwa Sugauli Rural Municipality',
      'Sakhuwa Prasauni Rural Municipality', 'Pakaha Mainpur Rural Municipality',
      'Thori Rural Municipality', 'Jirabhawani Rural Municipality',
    ],
    'Rautahat': [
      'Gaur Municipality', 'Chandrapur Municipality', 'Garuda Municipality',
      'Brindaban Municipality', 'Gujara Municipality', 'Gadhimai Municipality',
      'Baudhimai Municipality', 'Ishanath Municipality', 'Madhav Narayan Municipality',
      'Maulapur Municipality', 'Paroha Municipality', 'Phatuwa Bijayapur Municipality',
      'Rajpur Municipality', 'Dewahi Gonahi Municipality', 'Katahariya Municipality',
      'Rajdevi Municipality', 'Durga Bhagwati Rural Municipality', 'Yamunamai Rural Municipality',
    ],
    'Saptari': [
      'Rajbiraj Municipality', 'Kanchanrup Municipality', 'Dakneshwori Municipality',
      'Bodebarsain Municipality', 'Shambhunath Municipality', 'Surunga Municipality',
      'Hanumannagar Kankalini Municipality', 'Khadak Municipality',
      'Saptakoshi Municipality', 'Agnisaira Krishnasavaran Rural Municipality',
      'Mahadeva Rural Municipality', 'Rupani Rural Municipality',
      'Belhi Chapena Rural Municipality', 'Bishnupur Rural Municipality',
      'Tilathi Koiladi Rural Municipality', 'Rajgadh Rural Municipality',
      'Balan Bihul Rural Municipality', 'Chhinnamasta Rural Municipality',
    ],
    'Sarlahi': [
      'Malangwa Municipality', 'Lalbandi Municipality', 'Hariwan Municipality',
      'Ishworpur Municipality', 'Godaita Municipality', 'Barahathwa Municipality',
      'Haripur Municipality', 'Balara Municipality', 'Kabilasi Municipality',
      'Bagmati Municipality', 'Chandranagar Rural Municipality', 'Dhankaul Rural Municipality',
      'Parsa Rural Municipality', 'Bishnu Rural Municipality', 'Ramnagar Rural Municipality',
      'Brahampuri Rural Municipality', 'Kaudena Rural Municipality', 'Basbariya Rural Municipality',
      'Chakraghatta Rural Municipality', 'Haripurwa Rural Municipality',
    ],
    'Siraha': [
      'Siraha Municipality', 'Lahan Municipality', 'Dhangadhimai Municipality',
      'Mirchaiya Municipality', 'Golbazar Municipality', 'Kalyanpur Municipality',
      'Karjanha Municipality', 'Sukhipur Municipality', 'Bhagawanpur Rural Municipality',
      'Aurahi Rural Municipality', 'Bishnupur Rural Municipality', 'Bariyarpatti Rural Municipality',
      'Lakshmipur Patari Rural Municipality', 'Naraha Rural Municipality',
      'Sakhuwanankarkatti Rural Municipality', 'Arnama Rural Municipality',
      'Nawarajpur Rural Municipality',
    ],
  },

  'Bagmati Province': {
    'Bhaktapur': [
      'Bhaktapur Municipality', 'Madhyapur Thimi Municipality',
      'Suryabinayak Municipality', 'Changunarayan Municipality',
    ],
    'Chitwan': [
      'Bharatpur Metropolitan City', 'Ratnanagar Municipality', 'Khairahani Municipality',
      'Rapti Municipality', 'Kalika Municipality', 'Madi Municipality',
      'Ichchhakamana Rural Municipality',
    ],
    'Dhading': [
      'Dhunibeshi Municipality', 'Nilkantha Municipality',
      'Benighat Rorang Rural Municipality', 'Gajuri Rural Municipality',
      'Galchhi Rural Municipality', 'Gangajamuna Rural Municipality',
      'Jwalamukhi Rural Municipality', 'Khaniyabas Rural Municipality',
      'Netrawati Dabjong Rural Municipality', 'Rubi Valley Rural Municipality',
      'Siddhalek Rural Municipality', 'Thakre Rural Municipality', 'Tripurasundari Rural Municipality',
    ],
    'Dolakha': [
      'Bhimeshwar Municipality', 'Jiri Municipality',
      'Kalinchowk Rural Municipality', 'Melung Rural Municipality',
      'Bigu Rural Municipality', 'Gaurishankar Rural Municipality',
      'Baiteshwor Rural Municipality', 'Sailung Rural Municipality',
      'Tamakoshi Rural Municipality',
    ],
    'Kathmandu': [
      'Kathmandu Metropolitan City', 'Kageshwori Manahara Municipality',
      'Kirtipur Municipality', 'Gokarneshwor Municipality',
      'Chandragiri Municipality', 'Tokha Municipality',
      'Tarkeshwor Municipality', 'Nagarjun Municipality',
      'Budhanilkantha Municipality', 'Tarakeshwor Municipality',
      'Dakshinkali Municipality',
    ],
    'Kavrepalanchok': [
      'Dhulikhel Municipality', 'Banepa Municipality', 'Panauti Municipality',
      'Panchkhal Municipality', 'Namobuddha Municipality', 'Mandandeupur Municipality',
      'Khanikhola Rural Municipality', 'Chaurideurali Rural Municipality',
      'Temal Rural Municipality', 'Bhumlu Rural Municipality',
      'Bethanchowk Rural Municipality', 'Roshi Rural Municipality',
      'Mahabharat Rural Municipality',
    ],
    'Lalitpur': [
      'Lalitpur Metropolitan City', 'Godawari Municipality',
      'Mahalaxmi Municipality', 'Konjyosom Rural Municipality',
      'Bagmati Rural Municipality', 'Mahankal Rural Municipality',
    ],
    'Makwanpur': [
      'Hetauda Sub-Metropolitan City', 'Thaha Municipality',
      'Bhimphedi Rural Municipality', 'Makawanpurgadhi Rural Municipality',
      'Manahari Rural Municipality', 'Raksirang Rural Municipality',
      'Bakaiya Rural Municipality', 'Bagmati Rural Municipality',
      'Kailash Rural Municipality', 'Indrasarowar Rural Municipality',
    ],
    'Nuwakot': [
      'Bidur Municipality', 'Belkotgadhi Municipality',
      'Kakani Rural Municipality', 'Dupcheshwar Rural Municipality',
      'Shivapuri Rural Municipality', 'Kispang Rural Municipality',
      'Suryagadhi Rural Municipality', 'Tadi Rural Municipality',
      'Likhu Rural Municipality', 'Myagang Rural Municipality',
      'Tarkeshwar Rural Municipality', 'Panchakanya Rural Municipality',
    ],
    'Ramechhap': [
      'Manthali Municipality', 'Ramechhap Municipality',
      'Doramba Rural Municipality', 'Gokulganga Rural Municipality',
      'Khadadevi Rural Municipality', 'Likhu Tamakoshi Rural Municipality',
      'Sunapati Rural Municipality', 'Umakunda Rural Municipality',
    ],
    'Rasuwa': [
      'Uttargaya Rural Municipality', 'Kalika Rural Municipality',
      'Naukunda Rural Municipality', 'Parvati Kunda Rural Municipality',
      'Aamachhodingmo Rural Municipality', 'Gosaikunda Rural Municipality',
    ],
    'Sindhuli': [
      'Kamalamai Municipality', 'Dudhauli Municipality',
      'Sunkoshi Rural Municipality', 'Hariharpurgadhi Rural Municipality',
      'Tinpatan Rural Municipality', 'Marin Rural Municipality',
      'Golanjor Rural Municipality', 'Phikkal Rural Municipality',
      'Ghyanglekh Rural Municipality',
    ],
    'Sindhupalchok': [
      'Chautara Sangachokgadhi Municipality', 'Barhabise Municipality',
      'Melamchi Municipality', 'Bahrabise Municipality',
      'Panchpokhari Thangpal Rural Municipality', 'Jugal Rural Municipality',
      'Balefi Rural Municipality', 'Sunkoshi Rural Municipality',
      'Indrawati Rural Municipality', 'Tripurasundari Rural Municipality',
      'Lisankhu Pakhar Rural Municipality', 'Helambu Rural Municipality',
    ],
  },

  'Gandaki Province': {
    'Baglung': [
      'Baglung Municipality', 'Galkot Municipality', 'Jaimini Municipality',
      'Dhorpatan Municipality', 'Bareng Rural Municipality', 'Kathekhola Rural Municipality',
      'Taman Khola Rural Municipality', 'Tara Khola Rural Municipality',
      'Nisikhola Rural Municipality', 'Badigad Rural Municipality',
    ],
    'Gorkha': [
      'Gorkha Municipality', 'Palungtar Municipality', 'Sulikot Rural Municipality',
      'Siranchowk Rural Municipality', 'Ajirkot Rural Municipality',
      'Aarughat Rural Municipality', 'Gandaki Rural Municipality',
      'Dharche Rural Municipality', 'Bhimsen Rural Municipality',
      'Shahid Lakhan Rural Municipality', 'Barpak Sulikot Rural Municipality',
    ],
    'Kaski': [
      'Pokhara Metropolitan City', 'Annapurna Rural Municipality',
      'Machhapuchchhre Rural Municipality', 'Madi Rural Municipality',
      'Rupa Rural Municipality',
    ],
    'Lamjung': [
      'Besisahar Municipality', 'Sundarbazar Municipality', 'Rainas Municipality',
      'Midhill Municipality', 'Dordi Rural Municipality', 'Dudhpokhari Rural Municipality',
      'Kwholasothar Rural Municipality', 'Marsyangdi Rural Municipality',
    ],
    'Manang': [
      'Chame Rural Municipality', 'Narshon Rural Municipality',
      'Nashong Rural Municipality', 'Manang Ngisyang Rural Municipality',
    ],
    'Mustang': [
      'Gharapjhong Rural Municipality', 'Thasang Rural Municipality',
      'Barhagaun Muktichhetra Rural Municipality', 'Lomanthang Rural Municipality',
      'Lo-Ghekar Damodarkunda Rural Municipality',
    ],
    'Myagdi': [
      'Beni Municipality', 'Annapurna Rural Municipality',
      'Dhaulagiri Rural Municipality', 'Mangala Rural Municipality',
      'Malika Rural Municipality', 'Raghuganga Rural Municipality',
    ],
    'Nawalparasi East': [
      'Kawasoti Municipality', 'Gaindakot Municipality', 'Devchuli Municipality',
      'Madhyabindu Municipality', 'Binayi Triveni Rural Municipality',
      'Bulingtar Rural Municipality', 'Baudikali Rural Municipality',
      'Hupsekot Rural Municipality',
    ],
    'Parbat': [
      'Kushma Municipality', 'Phalebas Municipality', 'Jaljala Rural Municipality',
      'Paiyun Rural Municipality', 'Mahashila Rural Municipality',
      'Modi Rural Municipality', 'Bihadi Rural Municipality',
    ],
    'Syangja': [
      'Putalibazar Municipality', 'Waling Municipality', 'Chapakot Municipality',
      'Galyang Municipality', 'Bhirkot Municipality',
      'Arjun Chaupari Rural Municipality', 'Aandhikhola Rural Municipality',
      'Kaligandaki Rural Municipality', 'Phedikhola Rural Municipality',
      'Harinas Rural Municipality', 'Biruwa Rural Municipality',
    ],
    'Tanahun': [
      'Damauli Municipality', 'Bhanu Municipality', 'Shuklagandaki Municipality',
      'Byas Municipality', 'Bhimad Municipality',
      'Rishing Rural Municipality', 'Myagde Rural Municipality',
      'Bandipur Rural Municipality', 'Anbu Khaireni Rural Municipality',
      'Devghat Rural Municipality',
    ],
  },

  'Lumbini Province': {
    'Arghakhanchi': [
      'Sandhikharka Municipality', 'Sitganga Municipality', 'Bhumikasthan Municipality',
      'Shitaganga Municipality', 'Chhatradev Rural Municipality', 'Panini Rural Municipality',
    ],
    'Banke': [
      'Nepalgunj Sub-Metropolitan City', 'Kohalpur Municipality',
      'Narainapur Rural Municipality', 'Rapti Sonari Rural Municipality',
      'Baijnath Rural Municipality', 'Khajura Rural Municipality',
      'Duduwa Rural Municipality', 'Janaki Rural Municipality',
    ],
    'Bardiya': [
      'Gulariya Municipality', 'Rajapur Municipality', 'Madhuwan Municipality',
      'Thakurbaba Municipality', 'Bansagadhi Municipality', 'Barbardiya Municipality',
      'Badhaiyatal Rural Municipality', 'Geruwa Rural Municipality',
    ],
    'Dang': [
      'Tulsipur Sub-Metropolitan City', 'Ghorahi Sub-Metropolitan City',
      'Lamahi Municipality', 'Bangalachuli Rural Municipality',
      'Dangisharan Rural Municipality', 'Gadhawa Rural Municipality',
      'Rajpur Rural Municipality', 'Rapti Rural Municipality',
      'Shantinagar Rural Municipality', 'Babai Rural Municipality',
    ],
    'Gulmi': [
      'Tamghas Municipality', 'Resunga Municipality', 'Musikot Municipality',
      'Isma Rural Municipality', 'Chandrakot Rural Municipality',
      'Kaligandaki Rural Municipality', 'Gulmi Darbar Rural Municipality',
      'Madane Rural Municipality', 'Malika Rural Municipality',
      'Chatrakot Rural Municipality', 'Satyawati Rural Municipality',
      'Dhurkot Rural Municipality',
    ],
    'Kapilvastu': [
      'Kapilvastu Municipality', 'Buddhabhumi Municipality', 'Shivaraj Municipality',
      'Maharajgunj Municipality', 'Krishnanagar Municipality', 'Banganga Municipality',
      'Bijaynagar Rural Municipality', 'Mayadevi Rural Municipality',
      'Suddhodhan Rural Municipality', 'Yashodhara Rural Municipality',
    ],
    'Nawalparasi West': [
      'Bardaghat Municipality', 'Ramgram Municipality', 'Sunwal Municipality',
      'Susta Rural Municipality', 'Palhinandan Rural Municipality',
      'Pratappur Rural Municipality', 'Sarawal Rural Municipality',
    ],
    'Palpa': [
      'Tansen Municipality', 'Rampur Municipality', 'Rainadevi Chhahara Rural Municipality',
      'Bagnaskali Rural Municipality', 'Rambha Rural Municipality',
      'Purbakhola Rural Municipality', 'Nisdi Rural Municipality',
      'Mathagadhi Rural Municipality', 'Tinau Rural Municipality',
      'Ribdikot Rural Municipality',
    ],
    'Pyuthan': [
      'Pyuthan Municipality', 'Swargadwari Municipality',
      'Gaumukhi Rural Municipality', 'Mandavi Rural Municipality',
      'Mallarani Rural Municipality', 'Naubahini Rural Municipality',
      'Jhimruk Rural Municipality', 'Airawati Rural Municipality',
      'Sarumarani Rural Municipality',
    ],
    'Rolpa': [
      'Rolpa Municipality', 'Triveni Rural Municipality',
      'Runtigadhi Rural Municipality', 'Lungri Rural Municipality',
      'Sunchhahari Rural Municipality', 'Gangadev Rural Municipality',
      'Thawang Rural Municipality', 'Madi Rural Municipality',
      'Suwarnabati Rural Municipality', 'Pariwartan Rural Municipality',
    ],
    'Rukum East': [
      'Bhume Rural Municipality', 'Sisne Rural Municipality',
      'Putha Uttarganga Rural Municipality',
    ],
    'Rupandehi': [
      'Butwal Sub-Metropolitan City', 'Siddharthanagar Municipality',
      'Devdaha Municipality', 'Lumbini Sanskritik Municipality',
      'Sainamaina Municipality', 'Tilottama Municipality',
      'Gaidhahawa Rural Municipality', 'Kanchan Rural Municipality',
      'Kotahimai Rural Municipality', 'Marchawari Rural Municipality',
      'Mayadevi Rural Municipality', 'Omsatiya Rural Municipality',
      'Rohini Rural Municipality', 'Sammarimai Rural Municipality',
      'Siyari Rural Municipality', 'Suddhodhan Rural Municipality',
    ],
  },

  'Karnali Province': {
    'Dailekh': [
      'Narayan Municipality', 'Dullu Municipality', 'Chamunda Bindrasaini Municipality',
      'Aathabis Municipality', 'Bhagawatimai Rural Municipality',
      'Gurans Rural Municipality', 'Dungeshwar Rural Municipality',
      'Naumule Rural Municipality', 'Mahabu Rural Municipality',
      'Thantikandh Rural Municipality', 'Bhairabi Rural Municipality',
    ],
    'Dolpa': [
      'Thuli Bheri Municipality', 'Tripurasundari Municipality',
      'Dolpo Buddha Rural Municipality', 'Shey Phoksundo Rural Municipality',
      'Jagdulla Rural Municipality', 'Mudkechula Rural Municipality',
      'Kaike Rural Municipality', 'Chharka Tangsong Rural Municipality',
    ],
    'Humla': [
      'Simkot Rural Municipality', 'Namkha Rural Municipality',
      'Kharpunath Rural Municipality', 'Sarkegad Rural Municipality',
      'Chankheli Rural Municipality', 'Adanchuli Rural Municipality',
      'Tanjakot Rural Municipality',
    ],
    'Jajarkot': [
      'Bheri Municipality', 'Chhedagad Municipality', 'Nalgad Municipality',
      'Junichande Rural Municipality', 'Kuse Rural Municipality',
      'Barekot Rural Municipality', 'Shivalaya Rural Municipality',
    ],
    'Jumla': [
      'Chandannath Municipality', 'Tila Rural Municipality',
      'Kanaka Sundari Rural Municipality', 'Sinja Rural Municipality',
      'Hima Rural Municipality', 'Tatopani Rural Municipality',
      'Patarasi Rural Municipality', 'Guthichaur Rural Municipality',
    ],
    'Kalikot': [
      'Khandachakra Municipality', 'Tilagufa Municipality',
      'Raskot Municipality', 'Pachaljharana Rural Municipality',
      'Shubha Kalika Rural Municipality', 'Sanni Triveni Rural Municipality',
      'Narharinath Rural Municipality', 'Mahawai Rural Municipality',
      'Palata Rural Municipality',
    ],
    'Mugu': [
      'Chhayanath Rara Municipality', 'Mugum Karmarong Rural Municipality',
      'Soru Rural Municipality', 'Khamale Rural Municipality',
    ],
    'Rukum West': [
      'Musikot Municipality', 'Chaurjahari Municipality',
      'Aathbiskot Municipality', 'Banfikot Rural Municipality',
      'Triveni Rural Municipality', 'Sani Bheri Rural Municipality',
    ],
    'Salyan': [
      'Sharada Municipality', 'Bangad Kupinde Municipality',
      'Bagchaur Municipality', 'Chhatreshwori Rural Municipality',
      'Siddha Kumakh Rural Municipality', 'Darma Rural Municipality',
      'Kapurkot Rural Municipality', 'Kumakh Rural Municipality',
      'Kalimati Rural Municipality', 'Triveni Rural Municipality',
    ],
    'Surkhet': [
      'Birendranagar Municipality', 'Bheriganga Municipality',
      'Gurbhakot Municipality', 'Panchapuri Municipality',
      'Lekbeshi Municipality', 'Chaukune Rural Municipality',
      'Barahatal Rural Municipality', 'Simta Rural Municipality',
      'Chingad Rural Municipality',
    ],
  },

  'Sudurpashchim Province': {
    'Achham': [
      'Mangalsen Municipality', 'Sanfebagar Municipality', 'Kamalbazar Municipality',
      'Panchadewal Binayak Municipality', 'Bannigadhi Jayagadh Rural Municipality',
      'Chaurpati Rural Municipality', 'Dhakari Rural Municipality',
      'Mellekh Rural Municipality', 'Ramaroshan Rural Municipality',
      'Turmakhad Rural Municipality',
    ],
    'Baitadi': [
      'Dasharathchanda Municipality', 'Patan Municipality',
      'Melauli Municipality', 'Purchaudi Municipality',
      'Dogadakedar Rural Municipality', 'Dilasaini Rural Municipality',
      'Sigas Rural Municipality', 'Shivnath Rural Municipality',
      'Surnaya Rural Municipality', 'Pancheshwar Rural Municipality',
    ],
    'Bajhang': [
      'Jayaprithvi Municipality', 'Bungal Municipality',
      'Thalara Rural Municipality', 'Chainpur Rural Municipality',
      'Chabispathivera Rural Municipality', 'Durgathali Rural Municipality',
      'Kedarsyun Rural Municipality', 'Khaptad Chhanna Rural Municipality',
      'Masta Rural Municipality', 'Surma Rural Municipality',
      'Saipal Rural Municipality', 'Talkot Rural Municipality',
    ],
    'Bajura': [
      'Badimalika Municipality', 'Triveni Municipality', 'Budhiganga Municipality',
      'Budhinanda Municipality', 'Chhededaha Rural Municipality',
      'Gaumul Rural Municipality', 'Himali Rural Municipality',
      'Khaptad Chhededaha Rural Municipality', 'Swamikartik Khapar Rural Municipality',
    ],
    'Dadeldhura': [
      'Amargadhi Municipality', 'Parshuram Municipality',
      'Aalitaal Rural Municipality', 'Bhageshwar Rural Municipality',
      'Ganyapadhura Rural Municipality', 'Navadurga Rural Municipality',
      'Ajaymeru Rural Municipality',
    ],
    'Darchula': [
      'Mahakali Municipality', 'Shailyashikhar Municipality',
      'Malikarjun Rural Municipality', 'Marma Rural Municipality',
      'Lekam Rural Municipality', 'Naugad Rural Municipality',
      'Byas Rural Municipality', 'Duhun Rural Municipality',
      'Apihimal Rural Municipality',
    ],
    'Doti': [
      'Dipayal Silgadhi Municipality', 'Shikhar Municipality',
      'Purbichauki Rural Municipality', 'K.I. Singh Rural Municipality',
      'Jorayal Rural Municipality', 'Sayal Rural Municipality',
      'Aadarsha Rural Municipality', 'Bogatan Phudsil Rural Municipality',
      'Badikedar Rural Municipality',
    ],
    'Kailali': [
      'Dhangadhi Sub-Metropolitan City', 'Tikapur Municipality',
      'Ghodaghodi Municipality', 'Lamkichuha Municipality',
      'Bhajani Municipality', 'Godawari Municipality',
      'Gauriganga Municipality', 'Janaki Rural Municipality',
      'Bardagoriya Rural Municipality', 'Mohanyal Rural Municipality',
      'Kailari Rural Municipality', 'Joshipur Rural Municipality',
      'Chure Rural Municipality',
    ],
    'Kanchanpur': [
      'Bhimdatt Municipality', 'Punarbas Municipality', 'Bedkot Municipality',
      'Mahakali Municipality', 'Shuklaphanta Municipality',
      'Belauri Municipality', 'Krishnapur Municipality',
      'Laljhadi Rural Municipality', 'Beldandi Rural Municipality',
    ],
  },
};

export const NEPAL_PROVINCES = Object.keys(NEPAL_LOCATIONS);

export function getDistricts(province) {
  if (!province || !NEPAL_LOCATIONS[province]) return [];
  return Object.keys(NEPAL_LOCATIONS[province]).sort();
}

export function getMunicipalities(province, district) {
  if (!province || !district || !NEPAL_LOCATIONS[province]?.[district]) return [];
  return NEPAL_LOCATIONS[province][district].sort();
}

export default NEPAL_LOCATIONS;
