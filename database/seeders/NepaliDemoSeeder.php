<?php

namespace Database\Seeders;

use App\Models\FamilyTree;
use App\Models\LifeEvent;
use App\Models\Person;
use App\Models\Relationship;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class NepaliDemoSeeder extends Seeder
{
    public function run(): void
    {
        // ── Demo Nepali User ───────────────────────────────────────
        $rajesh = User::firstOrCreate(
            ['email' => 'rajesh@example.com'],
            [
                'name' => 'Rajesh Sharma',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '9841234567',
                'gender' => 'male',
                'date_of_birth' => '1985-04-12',
                'province' => 'Bagmati Province',
                'district' => 'Kathmandu',
                'municipality' => 'Kathmandu Metropolitan City',
                'address' => 'Ward-16, Baneshwor',
            ]
        );

        $sita = User::firstOrCreate(
            ['email' => 'sita@example.com'],
            [
                'name' => 'Sita Adhikari',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone' => '9860012345',
                'gender' => 'female',
                'date_of_birth' => '1990-11-20',
                'province' => 'Gandaki Province',
                'district' => 'Kaski',
                'municipality' => 'Pokhara Metropolitan City',
                'address' => 'Ward-6, Lakeside',
            ]
        );


        // ════════════════════════════════════════════════════════════
        //  TREE 1 — शर्मा परिवार (Sharma Parivaar)
        //  4 generations, Brahmin family from Gorkha/Kathmandu
        // ════════════════════════════════════════════════════════════
        $tree1 = FamilyTree::create([
            'name' => 'शर्मा परिवार — Sharma Family',
            'description' => 'चार पुस्ताको शर्मा परिवारको बंशावली — गोरखाबाट काठमाडौं सम्मको यात्रा। Four generations of the Sharma family, tracing roots from Gorkha to Kathmandu.',
            'owner_id' => $rajesh->id,
            'privacy' => 'public',
        ]);

        // ── पुस्ता १ — Generation 1 (Great-grandparents / हजुरबुबा-हजुरआमा) ──

        $dadaShri = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Hari Prasad',
            'middle_name' => '',
            'last_name' => 'Sharma',
            'nickname' => 'बडा बुबा',
            'gender' => 'male',
            'date_of_birth' => '1935-01-14',
            'birth_place' => 'Gorkha, Gandaki',
            'date_of_death' => '2010-03-20',
            'death_place' => 'Gorkha, Gandaki',
            'is_living' => false,
            'occupation' => 'Farmer / Priest (पुजारी)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Gorkha',
            'municipality' => 'Gorkha Municipality',
            'address' => 'Ward-4, Manakamana',
            'bio' => 'हरिप्रसाद शर्मा गोरखाका प्रसिद्ध पुजारी थिए। उनले मनकामना मन्दिरमा धेरै वर्ष सेवा गरे। Hari Prasad was a well-known priest in Gorkha who served at the Manakamana temple for decades.',
        ]);

        $dadaShriWife = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Tulsa',
            'last_name' => 'Sharma',
            'maiden_name' => 'Poudel',
            'gender' => 'female',
            'date_of_birth' => '1940-05-02',
            'birth_place' => 'Lamjung, Gandaki',
            'date_of_death' => '2015-08-10',
            'death_place' => 'Gorkha, Gandaki',
            'is_living' => false,
            'occupation' => 'Homemaker',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Gorkha',
            'municipality' => 'Gorkha Municipality',
            'address' => 'Ward-4, Manakamana',
            'bio' => 'तुलसा देवी लमजुङबाट विवाह गरी गोरखा आउनुभएको थियो। गाउँमा सबैले आमा भनेर चिन्थे। Tulsa Devi came from Lamjung after marriage. She was lovingly known as "Aama" by the whole village.',
        ]);

        // ── पुस्ता २ — Generation 2 (Grandparents / बुबा-आमा) ──

        $krishna = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Krishna Bahadur',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1960-09-18',
            'birth_place' => 'Gorkha, Gandaki',
            'is_living' => true,
            'occupation' => 'Retired Teacher (शिक्षक)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-32, Koteshwor',
            'phone' => '9841098765',
            'bio' => 'कृष्णबहादुर गोरखाको सरस्वती माविमा ३५ वर्ष शिक्षण गरे। सेवानिवृत्त भएपछि काठमाडौं बस्नुभयो। Krishna Bahadur taught at Saraswati Secondary School in Gorkha for 35 years before retiring to Kathmandu.',
        ]);

        $saraswati = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Saraswati',
            'last_name' => 'Sharma',
            'maiden_name' => 'Ghimire',
            'gender' => 'female',
            'date_of_birth' => '1965-02-10',
            'birth_place' => 'Tanahun, Gandaki',
            'is_living' => true,
            'occupation' => 'Homemaker',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-32, Koteshwor',
            'bio' => 'सरस्वती तनहुँबाट हुनुहुन्छ। उनले बच्चाहरूको पालनपोषण र परिवारको संस्कारमा ठूलो भूमिका निभाउनुभयो।',
        ]);

        $ramKanta = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Ram Kanta',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1963-07-01',
            'birth_place' => 'Gorkha, Gandaki',
            'is_living' => true,
            'occupation' => 'Businessman',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-8, New Road',
            'phone' => '9856012345',
            'bio' => 'रामकान्त पोखरामा किराना पसल सञ्चालन गर्नुहुन्छ। परिवारकै ठूला दाइ। Ram Kanta runs a grocery business in Pokhara. He is the eldest brother in the family.',
        ]);

        $kamala = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Kamala',
            'last_name' => 'Sharma',
            'maiden_name' => 'Devkota',
            'gender' => 'female',
            'date_of_birth' => '1967-11-15',
            'birth_place' => 'Syangja, Gandaki',
            'is_living' => true,
            'occupation' => 'Social Worker',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-8, New Road',
            'bio' => 'कमला स्याङ्जाबाट हुनुहुन्छ। महिला अधिकारमा सक्रिय, स्थानीय NGO मा कार्यरत।',
        ]);

        // ── पुस्ता ३ — Generation 3 (Parents / हामी) ──

        $rajeshP = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Rajesh',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1985-04-12',
            'birth_place' => 'Gorkha, Gandaki',
            'is_living' => true,
            'occupation' => 'Software Engineer',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-16, Baneshwor',
            'email' => 'rajesh.sharma@example.com',
            'phone' => '9841234567',
            'bio' => 'राजेश TU बाट Computer Science मा स्नातक गरी IT कम्पनीमा काम गर्दै हुनुहुन्छ। Rajesh graduated from Tribhuvan University and works as a software engineer in Kathmandu.',
        ]);

        $anita = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Anita',
            'last_name' => 'Sharma',
            'maiden_name' => 'Thapa',
            'gender' => 'female',
            'date_of_birth' => '1988-08-25',
            'birth_place' => 'Chitwan, Bagmati',
            'is_living' => true,
            'occupation' => 'Bank Officer',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-16, Baneshwor',
            'email' => 'anita.sharma@example.com',
            'phone' => '9841567890',
            'bio' => 'अनिता चितवनबाट हुनुहुन्छ। नेपाल बैंकमा अधिकृत पदमा कार्यरत। Anita is from Chitwan and works as an officer at Nepal Bank.',
        ]);

        $bikash = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Bikash',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1988-12-05',
            'birth_place' => 'Gorkha, Gandaki',
            'is_living' => true,
            'occupation' => 'Doctor (चिकित्सक)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Lalitpur',
            'municipality' => 'Lalitpur Metropolitan City',
            'address' => 'Ward-12, Pulchowk',
            'phone' => '9860123456',
            'bio' => 'बिकास IOM बाट MBBS गरी पाटन अस्पताललमा कार्यरत। Bikash completed MBBS from IOM and works at Patan Hospital.',
        ]);

        $priya = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Priya',
            'last_name' => 'Sharma',
            'maiden_name' => 'Bhandari',
            'gender' => 'female',
            'date_of_birth' => '1991-03-17',
            'birth_place' => 'Lalitpur, Bagmati',
            'is_living' => true,
            'occupation' => 'Teacher (शिक्षिका)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Lalitpur',
            'municipality' => 'Lalitpur Metropolitan City',
            'address' => 'Ward-12, Pulchowk',
            'bio' => 'प्रिया ललितपुरकी हुन्, बुद्ध माविमा शिक्षिका। Priya teaches at Buddha Secondary School in Lalitpur.',
        ]);

        $sunita = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Sunita',
            'last_name' => 'Gurung',
            'maiden_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '1987-06-22',
            'birth_place' => 'Gorkha, Gandaki',
            'is_living' => true,
            'occupation' => 'Nurse',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-11, Bagar',
            'phone' => '9856011111',
            'bio' => 'सुनिता शर्मा (विवाह पछि गुरुङ), पोखराको पश्चिमाञ्चल अस्पतालमा नर्स। Sunita married Dipak Gurung and works as a nurse at Western Regional Hospital, Pokhara.',
        ]);

        $dipak = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Dipak',
            'last_name' => 'Gurung',
            'gender' => 'male',
            'date_of_birth' => '1984-10-10',
            'birth_place' => 'Kaski, Gandaki',
            'is_living' => true,
            'occupation' => 'Hotel Manager',
            'religion' => 'Buddhist',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-11, Bagar',
            'bio' => 'दीपक लेकसाइडमा होटल सञ्चालन गर्नुहुन्छ। Dipak manages a lakeside hotel in Pokhara.',
        ]);

        $manish = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Manish',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1990-01-05',
            'birth_place' => 'Pokhara, Gandaki',
            'is_living' => true,
            'occupation' => 'Abroad (Foreign Employment)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-8, New Road',
            'phone' => '9746012345',
            'bio' => 'मनिष हाल अष्ट्रेलिया सिड्नीमा बस्दै हुनुहुन्छ। Manish currently lives in Sydney, Australia for work.',
        ]);

        $sabina = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Sabina',
            'last_name' => 'Sharma',
            'maiden_name' => 'Karki',
            'gender' => 'female',
            'date_of_birth' => '1993-09-30',
            'birth_place' => 'Dhading, Bagmati',
            'is_living' => true,
            'occupation' => 'Accountant',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-8, New Road',
            'bio' => 'सबिना हाल अष्ट्रेलियामा मनिषसँग बसोबास गर्दै हुनुहुन्छिन्। Sabina joined Manish in Australia; they married in 2019.',
        ]);

        // ── पुस्ता ४ — Generation 4 (Children / बच्चाहरू) ──

        $aarav = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Aarav',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '2012-11-15',
            'birth_place' => 'Kathmandu, Bagmati',
            'is_living' => true,
            'occupation' => 'Student (Class 8)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-16, Baneshwor',
            'bio' => 'आरव कक्षा ८ मा पढ्दै छन्। क्रिकेट र coding मा रुचि राख्छन्। Aarav studies in class 8 and loves cricket and coding.',
        ]);

        $aashika = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Aashika',
            'last_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '2015-07-03',
            'birth_place' => 'Kathmandu, Bagmati',
            'is_living' => true,
            'occupation' => 'Student (Class 5)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-16, Baneshwor',
            'bio' => 'आशिका कक्षा ५ मा पढ्दै छिन्। नृत्य र चित्रकलामा रुचि। Aashika studies in class 5 and enjoys dance and painting.',
        ]);

        $sagar = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Sagar',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '2016-04-10',
            'birth_place' => 'Lalitpur, Bagmati',
            'is_living' => true,
            'occupation' => 'Student (Class 4)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Lalitpur',
            'municipality' => 'Lalitpur Metropolitan City',
            'address' => 'Ward-12, Pulchowk',
            'bio' => 'सागर बिकास र प्रियाको छोरो। Sagar is the son of Bikash and Priya.',
        ]);

        $nisha = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Nisha',
            'last_name' => 'Gurung',
            'gender' => 'female',
            'date_of_birth' => '2014-12-25',
            'birth_place' => 'Pokhara, Gandaki',
            'is_living' => true,
            'occupation' => 'Student (Class 6)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-11, Bagar',
            'bio' => 'निशा सुनिता र दीपककी छोरी। तैरनमा जिल्ला स्तरमा सहभागी। Nisha is the daughter of Sunita and Dipak. She competes in district-level swimming.',
        ]);

        $arjun = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Arjun',
            'last_name' => 'Gurung',
            'gender' => 'male',
            'date_of_birth' => '2018-06-08',
            'birth_place' => 'Pokhara, Gandaki',
            'is_living' => true,
            'occupation' => 'Student (Class 2)',
            'religion' => 'Buddhist',
            'nationality' => 'Nepali',
            'province' => 'Gandaki Province',
            'district' => 'Kaski',
            'municipality' => 'Pokhara Metropolitan City',
            'address' => 'Ward-11, Bagar',
            'bio' => 'अर्जुन सबैभन्दा सानो, कक्षा २ मा पढ्दै। Arjun is the youngest, studying in class 2.',
        ]);

        $anaya = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Anaya',
            'last_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '2022-01-12',
            'birth_place' => 'Sydney, Australia',
            'is_living' => true,
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'bio' => 'अनया अष्ट्रेलियामा जन्मिएकी, मनिष र सबिनाकी छोरी। Anaya was born in Sydney, daughter of Manish and Sabina.',
        ]);


        // ════════════════════════════════════════════════════════════
        //  RELATIONSHIPS — शर्मा परिवार
        // ════════════════════════════════════════════════════════════

        // Gen 1: Hari Prasad & Tulsa — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $dadaShri->id,
            'person2_id' => $dadaShriWife->id,
            'type' => 'spouse',
            'start_date' => '1958-02-10',
            'start_place' => 'Gorkha',
        ]);

        // Gen 1 → Gen 2: Parents of Krishna Bahadur & Ram Kanta
        foreach ([$krishna, $ramKanta] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $dadaShri->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $dadaShriWife->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 2 siblings
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $krishna->id,
            'person2_id' => $ramKanta->id,
            'type' => 'sibling',
        ]);

        // Gen 2: Krishna & Saraswati — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $krishna->id,
            'person2_id' => $saraswati->id,
            'type' => 'spouse',
            'start_date' => '1983-11-25',
            'start_place' => 'Gorkha',
        ]);

        // Gen 2: Ram Kanta & Kamala — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $ramKanta->id,
            'person2_id' => $kamala->id,
            'type' => 'spouse',
            'start_date' => '1986-05-10',
            'start_place' => 'Pokhara',
        ]);

        // Gen 2 → Gen 3: Krishna & Saraswati's children (Rajesh, Bikash)
        foreach ([$rajeshP, $bikash] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $krishna->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $saraswati->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 2 → Gen 3: Ram Kanta & Kamala's children (Sunita, Manish)
        foreach ([$sunita, $manish] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $ramKanta->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $kamala->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 3 siblings
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $rajeshP->id,
            'person2_id' => $bikash->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $sunita->id,
            'person2_id' => $manish->id,
            'type' => 'sibling',
        ]);

        // Gen 3: Rajesh & Anita — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $rajeshP->id,
            'person2_id' => $anita->id,
            'type' => 'spouse',
            'start_date' => '2010-12-01',
            'start_place' => 'Kathmandu',
        ]);

        // Gen 3: Bikash & Priya — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $bikash->id,
            'person2_id' => $priya->id,
            'type' => 'spouse',
            'start_date' => '2014-04-15',
            'start_place' => 'Lalitpur',
        ]);

        // Gen 3: Sunita & Dipak — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $sunita->id,
            'person2_id' => $dipak->id,
            'type' => 'spouse',
            'start_date' => '2012-02-20',
            'start_place' => 'Pokhara',
        ]);

        // Gen 3: Manish & Sabina — Spouse
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $manish->id,
            'person2_id' => $sabina->id,
            'type' => 'spouse',
            'start_date' => '2019-06-15',
            'start_place' => 'Sydney, Australia',
        ]);

        // Gen 3 → Gen 4: Rajesh & Anita's children
        foreach ([$aarav, $aashika] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $rajeshP->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $anita->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Bikash & Priya's child
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $bikash->id,
            'person2_id' => $sagar->id,
            'type' => 'parent_child',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $priya->id,
            'person2_id' => $sagar->id,
            'type' => 'parent_child',
        ]);

        // Sunita & Dipak's children
        foreach ([$nisha, $arjun] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $sunita->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $dipak->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Manish & Sabina's child
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $manish->id,
            'person2_id' => $anaya->id,
            'type' => 'parent_child',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $sabina->id,
            'person2_id' => $anaya->id,
            'type' => 'parent_child',
        ]);

        // Gen 4 siblings
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $aarav->id,
            'person2_id' => $aashika->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $nisha->id,
            'person2_id' => $arjun->id,
            'type' => 'sibling',
        ]);


        // ════════════════════════════════════════════════════════════
        //  LIFE EVENTS — शर्मा परिवार
        // ════════════════════════════════════════════════════════════

        $this->createLifeEvents($dadaShri, [
            ['type' => 'birth', 'title' => 'गोरखामा जन्म', 'event_date' => '1935-01-14', 'event_place' => 'Gorkha'],
            ['type' => 'religious', 'title' => 'ब्रतबन्ध (Upanayana)', 'description' => 'वैदिक संस्कार अनुसार ब्रतबन्ध सम्पन्न।', 'event_date' => '1947-04-01', 'event_place' => 'Gorkha'],
            ['type' => 'marriage', 'title' => 'तुलसा पौडेलसँग विवाह', 'event_date' => '1958-02-10', 'event_place' => 'Gorkha'],
            ['type' => 'occupation', 'title' => 'मनकामनामा पुजारी नियुक्ति', 'description' => 'मनकामना मन्दिरमा मुख्य पुजारीको रूपमा सेवा सुरु।', 'event_date' => '1960-01-01', 'event_place' => 'Manakamana, Gorkha'],
            ['type' => 'retirement', 'title' => 'सेवाबाट अवकाश', 'event_date' => '2000-01-01', 'event_place' => 'Gorkha'],
            ['type' => 'death', 'title' => 'निधन', 'description' => '७५ वर्षको उमेरमा शान्तिपूर्ण निधन।', 'event_date' => '2010-03-20', 'event_place' => 'Gorkha'],
        ]);

        $this->createLifeEvents($krishna, [
            ['type' => 'birth', 'title' => 'गोरखामा जन्म', 'event_date' => '1960-09-18', 'event_place' => 'Gorkha'],
            ['type' => 'education', 'title' => 'SLC Pass', 'description' => 'गोरखा सरस्वती माविबाट SLC उत्तीर्ण।', 'event_date' => '1978-05-01', 'event_place' => 'Gorkha'],
            ['type' => 'education', 'title' => 'IA Pass (TU)', 'description' => 'त्रिभुवन विश्वविद्यालयबाट स्नातक।', 'event_date' => '1982-06-01', 'event_place' => 'Kathmandu'],
            ['type' => 'marriage', 'title' => 'सरस्वती घिमिरेसँग विवाह', 'event_date' => '1983-11-25', 'event_place' => 'Gorkha'],
            ['type' => 'occupation', 'title' => 'शिक्षक नियुक्ति', 'description' => 'सरस्वती माविमा स्थायी शिक्षक नियुक्ति।', 'event_date' => '1984-01-15', 'event_place' => 'Gorkha'],
            ['type' => 'migration', 'title' => 'काठमाडौं सरे', 'description' => 'सेवानिवृत्त भएपछि काठमाडौं कोटेश्वरमा बस्न सरे।', 'event_date' => '2020-01-01', 'event_place' => 'Kathmandu'],
        ]);

        $this->createLifeEvents($rajeshP, [
            ['type' => 'birth', 'title' => 'गोरखामा जन्म', 'event_date' => '1985-04-12', 'event_place' => 'Gorkha'],
            ['type' => 'religious', 'title' => 'ब्रतबन्ध (Upanayana)', 'event_date' => '1996-03-15', 'event_place' => 'Gorkha'],
            ['type' => 'education', 'title' => 'SLC Pass', 'event_date' => '2002-06-01', 'event_place' => 'Gorkha'],
            ['type' => 'education', 'title' => 'BSc CSIT (Tribhuvan University)', 'event_date' => '2008-12-01', 'event_place' => 'Kathmandu'],
            ['type' => 'occupation', 'title' => 'Software Engineer काम सुरु', 'description' => 'काठमाडौंको IT कम्पनीमा जागिर सुरु।', 'event_date' => '2009-03-01', 'event_place' => 'Kathmandu'],
            ['type' => 'marriage', 'title' => 'अनिता थापासँग विवाह', 'event_date' => '2010-12-01', 'event_place' => 'Kathmandu'],
        ]);

        $this->createLifeEvents($sunita, [
            ['type' => 'birth', 'title' => 'गोरखामा जन्म', 'event_date' => '1987-06-22', 'event_place' => 'Gorkha'],
            ['type' => 'education', 'title' => 'PCL Nursing (Pokhara)', 'event_date' => '2008-05-01', 'event_place' => 'Pokhara'],
            ['type' => 'marriage', 'title' => 'दीपक गुरुङसँग विवाह', 'event_date' => '2012-02-20', 'event_place' => 'Pokhara'],
            ['type' => 'occupation', 'title' => 'पश्चिमाञ्चल अस्पतालमा Nurse', 'event_date' => '2009-01-01', 'event_place' => 'Pokhara'],
        ]);

        $this->createLifeEvents($manish, [
            ['type' => 'birth', 'title' => 'पोखरामा जन्म', 'event_date' => '1990-01-05', 'event_place' => 'Pokhara'],
            ['type' => 'education', 'title' => 'BBA (Pokhara University)', 'event_date' => '2012-06-01', 'event_place' => 'Pokhara'],
            ['type' => 'immigration', 'title' => 'अष्ट्रेलिया गए', 'description' => 'Masters गर्न Sydney गए।', 'event_date' => '2015-02-01', 'event_place' => 'Sydney, Australia'],
            ['type' => 'marriage', 'title' => 'सबिना कार्कीसँग विवाह', 'event_date' => '2019-06-15', 'event_place' => 'Sydney, Australia'],
        ]);


        // ════════════════════════════════════════════════════════════
        //  TREE 2 — थापा परिवार (Thapa Parivaar)
        //  3 generations, Chhetri family from Chitwan/Dharan
        // ════════════════════════════════════════════════════════════
        $tree2 = FamilyTree::create([
            'name' => 'थापा परिवार — Thapa Family',
            'description' => 'तीन पुस्ताको थापा परिवार — चितवनबाट धरान र काठमाडौंसम्म। Three generations of the Thapa family from Chitwan to Dharan and Kathmandu.',
            'owner_id' => $sita->id,
            'privacy' => 'shared',
        ]);

        // ── Gen 1 (Grandparents) ──

        $dalBahadur = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Dal Bahadur',
            'last_name' => 'Thapa',
            'gender' => 'male',
            'date_of_birth' => '1950-08-15',
            'birth_place' => 'Chitwan, Bagmati',
            'date_of_death' => '2020-04-12',
            'death_place' => 'Chitwan, Bagmati',
            'is_living' => false,
            'occupation' => 'Nepal Army (Retired Subedar)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Chitwan',
            'municipality' => 'Bharatpur Metropolitan City',
            'address' => 'Ward-5, Narayangadh',
            'bio' => 'दलबहादुर नेपाली सेनाबाट सुबेदार पदमा सेवानिवृत्त। भरतपुरमा बसोबास। Dal Bahadur retired as Subedar from Nepal Army. Known for his discipline and community leadership.',
        ]);

        $menuka = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Menuka',
            'last_name' => 'Thapa',
            'maiden_name' => 'Basnet',
            'gender' => 'female',
            'date_of_birth' => '1955-03-20',
            'birth_place' => 'Chitwan, Bagmati',
            'is_living' => true,
            'occupation' => 'Homemaker',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Chitwan',
            'municipality' => 'Bharatpur Metropolitan City',
            'address' => 'Ward-5, Narayangadh',
            'bio' => 'मेनुका चितवनकी हुनुहुन्छ। परिवारकी स्तम्भ।',
        ]);

        // ── Gen 2 (Parents) ──

        $gopal = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Gopal',
            'last_name' => 'Thapa',
            'gender' => 'male',
            'date_of_birth' => '1975-06-10',
            'birth_place' => 'Chitwan, Bagmati',
            'is_living' => true,
            'occupation' => 'Civil Engineer',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Koshi Province',
            'district' => 'Sunsari',
            'municipality' => 'Dharan Sub-Metropolitan City',
            'address' => 'Ward-2, Panbari',
            'phone' => '9852012345',
            'bio' => 'गोपाल NEC बाट Civil Engineering गरी धरानमा कार्यरत। Gopal is a civil engineer working in Dharan.',
        ]);

        $laxmi = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Laxmi',
            'last_name' => 'Thapa',
            'maiden_name' => 'Rai',
            'gender' => 'female',
            'date_of_birth' => '1978-12-28',
            'birth_place' => 'Dhankuta, Koshi',
            'is_living' => true,
            'occupation' => 'Primary Teacher',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Koshi Province',
            'district' => 'Sunsari',
            'municipality' => 'Dharan Sub-Metropolitan City',
            'address' => 'Ward-2, Panbari',
            'bio' => 'लक्ष्मी धनकुटाकी हुनुहुन्छ। प्राथमिक शिक्षिका। Laxmi is from Dhankuta and teaches primary school in Dharan.',
        ]);

        $gita = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Gita',
            'last_name' => 'KC',
            'maiden_name' => 'Thapa',
            'gender' => 'female',
            'date_of_birth' => '1978-01-15',
            'birth_place' => 'Chitwan, Bagmati',
            'is_living' => true,
            'occupation' => 'Businesswoman',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-4, Balaju',
            'bio' => 'गीता (थापा) KC, काठमाडौंमा कपडा व्यापार। Gita runs a clothing business in Kathmandu.',
        ]);

        $purna = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Purna Bahadur',
            'last_name' => 'KC',
            'gender' => 'male',
            'date_of_birth' => '1974-09-08',
            'birth_place' => 'Nuwakot, Bagmati',
            'is_living' => true,
            'occupation' => 'Government Officer',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-4, Balaju',
        ]);

        // ── Gen 3 (Children) ──

        $roshan = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Roshan',
            'last_name' => 'Thapa',
            'gender' => 'male',
            'date_of_birth' => '2002-05-18',
            'birth_place' => 'Dharan, Koshi',
            'is_living' => true,
            'occupation' => 'Engineering Student',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Koshi Province',
            'district' => 'Sunsari',
            'municipality' => 'Dharan Sub-Metropolitan City',
            'address' => 'Ward-2, Panbari',
            'bio' => 'रोशन IOE पुल्चोकमा Civil Engineering पढ्दै। Roshan studies civil engineering at IOE Pulchowk.',
        ]);

        $asmita = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Asmita',
            'last_name' => 'Thapa',
            'gender' => 'female',
            'date_of_birth' => '2005-10-03',
            'birth_place' => 'Dharan, Koshi',
            'is_living' => true,
            'occupation' => 'Student (+2 Science)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Koshi Province',
            'district' => 'Sunsari',
            'municipality' => 'Dharan Sub-Metropolitan City',
            'address' => 'Ward-2, Panbari',
            'bio' => 'अस्मिता +2 Science पढ्दैछिन्। Doctor बन्ने सपना। Asmita studies +2 Science and dreams of becoming a doctor.',
        ]);

        $prakriti = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Prakriti',
            'last_name' => 'KC',
            'gender' => 'female',
            'date_of_birth' => '2003-07-22',
            'birth_place' => 'Kathmandu, Bagmati',
            'is_living' => true,
            'occupation' => 'BBA Student',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-4, Balaju',
            'bio' => 'प्रकृति काठमाडौंमा BBA पढ्दै। Prakriti studies BBA in Kathmandu.',
        ]);

        $sahil = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Sahil',
            'last_name' => 'KC',
            'gender' => 'male',
            'date_of_birth' => '2008-02-14',
            'birth_place' => 'Kathmandu, Bagmati',
            'is_living' => true,
            'occupation' => 'Student (Class 8)',
            'religion' => 'Hindu',
            'nationality' => 'Nepali',
            'province' => 'Bagmati Province',
            'district' => 'Kathmandu',
            'municipality' => 'Kathmandu Metropolitan City',
            'address' => 'Ward-4, Balaju',
            'bio' => 'साहिल कक्षा ८ मा, फुटबल र गेमिङमा रुचि। Sahil studies in class 8 and loves football and gaming.',
        ]);


        // ════════════════════════════════════════════════════════════
        //  RELATIONSHIPS — थापा परिवार
        // ════════════════════════════════════════════════════════════

        // Gen 1: Dal Bahadur & Menuka
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $dalBahadur->id,
            'person2_id' => $menuka->id,
            'type' => 'spouse',
            'start_date' => '1973-05-18',
            'start_place' => 'Chitwan',
        ]);

        // Gen 1 → Gen 2
        foreach ([$gopal, $gita] as $child) {
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $dalBahadur->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $menuka->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 2 siblings
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $gopal->id,
            'person2_id' => $gita->id,
            'type' => 'sibling',
        ]);

        // Gen 2: Gopal & Laxmi
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $gopal->id,
            'person2_id' => $laxmi->id,
            'type' => 'spouse',
            'start_date' => '2000-11-25',
            'start_place' => 'Dharan',
        ]);

        // Gen 2: Gita & Purna
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $gita->id,
            'person2_id' => $purna->id,
            'type' => 'spouse',
            'start_date' => '1998-04-02',
            'start_place' => 'Kathmandu',
        ]);

        // Gen 2 → Gen 3: Gopal & Laxmi's children
        foreach ([$roshan, $asmita] as $child) {
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $gopal->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $laxmi->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 2 → Gen 3: Gita & Purna's children
        foreach ([$prakriti, $sahil] as $child) {
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $gita->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $purna->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 3 siblings
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $roshan->id,
            'person2_id' => $asmita->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $prakriti->id,
            'person2_id' => $sahil->id,
            'type' => 'sibling',
        ]);


        // ════════════════════════════════════════════════════════════
        //  LIFE EVENTS — थापा परिवार
        // ════════════════════════════════════════════════════════════

        $this->createLifeEvents($dalBahadur, [
            ['type' => 'birth', 'title' => 'चितवनमा जन्म', 'event_date' => '1950-08-15', 'event_place' => 'Chitwan'],
            ['type' => 'occupation', 'title' => 'नेपाली सेनामा भर्ना', 'description' => 'Nepal Army मा sipahi भर्ना।', 'event_date' => '1970-01-15', 'event_place' => 'Kathmandu'],
            ['type' => 'marriage', 'title' => 'मेनुका बस्नेतसँग विवाह', 'event_date' => '1973-05-18', 'event_place' => 'Chitwan'],
            ['type' => 'military', 'title' => 'Subedar पदमा बढुवा', 'event_date' => '1995-01-01', 'event_place' => 'Kathmandu'],
            ['type' => 'retirement', 'title' => 'सेनाबाट सेवानिवृत्त', 'event_date' => '2005-08-15', 'event_place' => 'Chitwan'],
            ['type' => 'death', 'title' => 'निधन', 'description' => 'मुटुरोगका कारण ७० वर्षमा निधन।', 'event_date' => '2020-04-12', 'event_place' => 'Chitwan'],
        ]);

        $this->createLifeEvents($gopal, [
            ['type' => 'birth', 'title' => 'चितवनमा जन्म', 'event_date' => '1975-06-10', 'event_place' => 'Chitwan'],
            ['type' => 'education', 'title' => 'SLC Pass', 'event_date' => '1992-06-01', 'event_place' => 'Chitwan'],
            ['type' => 'education', 'title' => 'BE Civil (NEC Dharan)', 'event_date' => '1999-12-01', 'event_place' => 'Dharan'],
            ['type' => 'marriage', 'title' => 'लक्ष्मी राईसँग विवाह', 'event_date' => '2000-11-25', 'event_place' => 'Dharan'],
            ['type' => 'occupation', 'title' => 'Engineer काम सुरु', 'event_date' => '2001-03-01', 'event_place' => 'Dharan'],
        ]);

        $this->createLifeEvents($roshan, [
            ['type' => 'birth', 'title' => 'धरानमा जन्म', 'event_date' => '2002-05-18', 'event_place' => 'Dharan'],
            ['type' => 'education', 'title' => 'SEE Pass (GPA 3.8)', 'event_date' => '2018-06-01', 'event_place' => 'Dharan'],
            ['type' => 'education', 'title' => '+2 Science Pass', 'event_date' => '2020-06-01', 'event_place' => 'Dharan'],
            ['type' => 'education', 'title' => 'IOE Entrance Pass — Civil Engineering', 'event_date' => '2020-12-01', 'event_place' => 'Kathmandu'],
        ]);

        echo "✅ Nepali demo data seeded successfully!\n";
        echo "   • शर्मा परिवार: 20 members, 4 generations\n";
        echo "   • थापा परिवार: 10 members, 3 generations\n";
        echo "   • Users: rajesh@example.com / sita@example.com (password: password)\n";
    }

    private function createLifeEvents(Person $person, array $events): void
    {
        foreach ($events as $i => $event) {
            LifeEvent::create(array_merge($event, [
                'person_id' => $person->id,
                'sort_order' => $i + 1,
            ]));
        }
    }
}
