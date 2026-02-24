<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\FamilyTree;
use App\Models\LifeEvent;
use App\Models\Person;
use App\Models\Relationship;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // ── Demo User ──────────────────────────────────────────────
        $user = User::create([
            'name' => 'John Demo',
            'email' => 'demo@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $user2 = User::create([
            'name' => 'Sarah Demo',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // ── Family Tree 1: The Anderson Family ─────────────────────
        $tree1 = FamilyTree::create([
            'name' => 'The Anderson Family',
            'description' => 'Four generations of the Anderson family, tracing roots from Sweden to America.',
            'owner_id' => $user->id,
            'privacy' => 'private',
        ]);

        // ── Generation 1 (Great-grandparents) ──────────────────────
        $erikAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Erik',
            'last_name' => 'Anderson',
            'gender' => 'male',
            'date_of_birth' => '1920-03-15',
            'birth_place' => 'Gothenburg, Sweden',
            'date_of_death' => '1998-11-02',
            'death_place' => 'Minneapolis, Minnesota',
            'is_living' => false,
            'occupation' => 'Carpenter',
            'nationality' => 'Swedish-American',
            'religion' => 'Lutheran',
            'bio' => 'Erik emigrated from Sweden in 1945 after World War II. He built a successful carpentry business in Minneapolis and was known for his craftsmanship and generosity.',
            'tree_position_x' => 0,
            'tree_position_y' => 0,
        ]);

        $ingridAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Ingrid',
            'last_name' => 'Anderson',
            'maiden_name' => 'Lindqvist',
            'gender' => 'female',
            'date_of_birth' => '1922-07-08',
            'birth_place' => 'Stockholm, Sweden',
            'date_of_death' => '2005-01-20',
            'death_place' => 'Minneapolis, Minnesota',
            'is_living' => false,
            'occupation' => 'Nurse',
            'nationality' => 'Swedish-American',
            'religion' => 'Lutheran',
            'bio' => 'Ingrid was a devoted nurse who worked at Hennepin County Medical Center for over 30 years. She and Erik met on the ship crossing the Atlantic.',
            'tree_position_x' => 300,
            'tree_position_y' => 0,
        ]);

        // ── Generation 2 (Grandparents) ────────────────────────────
        $robertAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Robert',
            'middle_name' => 'Erik',
            'last_name' => 'Anderson',
            'gender' => 'male',
            'date_of_birth' => '1948-06-12',
            'birth_place' => 'Minneapolis, Minnesota',
            'date_of_death' => '2020-09-15',
            'death_place' => 'St. Paul, Minnesota',
            'is_living' => false,
            'occupation' => 'Professor of History',
            'nationality' => 'American',
            'religion' => 'Lutheran',
            'bio' => 'Robert was a respected history professor at the University of Minnesota. He authored three books on Scandinavian immigration to the American Midwest.',
            'tree_position_x' => 0,
            'tree_position_y' => 200,
        ]);

        $margaretAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Margaret',
            'middle_name' => 'Rose',
            'last_name' => 'Anderson',
            'maiden_name' => 'O\'Brien',
            'gender' => 'female',
            'date_of_birth' => '1950-12-25',
            'birth_place' => 'Chicago, Illinois',
            'is_living' => true,
            'occupation' => 'Retired Teacher',
            'nationality' => 'American',
            'religion' => 'Catholic',
            'bio' => 'Margaret taught elementary school for 35 years. She is an avid gardener and volunteers at the local library.',
            'tree_position_x' => 300,
            'tree_position_y' => 200,
        ]);

        $helenAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Helen',
            'last_name' => 'Johansson',
            'maiden_name' => 'Anderson',
            'gender' => 'female',
            'date_of_birth' => '1952-04-03',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'Retired Accountant',
            'nationality' => 'American',
            'religion' => 'Lutheran',
            'bio' => 'Helen worked as a CPA for a major accounting firm. She now enjoys traveling with her husband.',
            'tree_position_x' => 600,
            'tree_position_y' => 200,
        ]);

        $karlJohansson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Karl',
            'last_name' => 'Johansson',
            'gender' => 'male',
            'date_of_birth' => '1949-09-18',
            'birth_place' => 'Duluth, Minnesota',
            'is_living' => true,
            'occupation' => 'Retired Engineer',
            'nationality' => 'American',
            'religion' => 'Lutheran',
            'tree_position_x' => 900,
            'tree_position_y' => 200,
        ]);

        // ── Generation 3 (Parents) ────────────────────────────────
        $davidAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'David',
            'middle_name' => 'Robert',
            'last_name' => 'Anderson',
            'gender' => 'male',
            'date_of_birth' => '1975-02-14',
            'birth_place' => 'St. Paul, Minnesota',
            'is_living' => true,
            'occupation' => 'Software Architect',
            'nationality' => 'American',
            'email' => 'david.anderson@email.com',
            'phone' => '(612) 555-0142',
            'bio' => 'David is a senior software architect at a Fortune 500 company. He enjoys woodworking, continuing his great-grandfather Erik\'s tradition.',
            'tree_position_x' => 0,
            'tree_position_y' => 400,
        ]);

        $lisaAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Lisa',
            'middle_name' => 'Marie',
            'last_name' => 'Anderson',
            'maiden_name' => 'Chen',
            'gender' => 'female',
            'date_of_birth' => '1978-08-22',
            'birth_place' => 'San Francisco, California',
            'is_living' => true,
            'occupation' => 'Pediatrician',
            'nationality' => 'American',
            'email' => 'lisa.chen.anderson@email.com',
            'bio' => 'Lisa is a pediatrician at a children\'s hospital. She met David during college at Stanford.',
            'tree_position_x' => 300,
            'tree_position_y' => 400,
        ]);

        $sarahAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Sarah',
            'middle_name' => 'Ingrid',
            'last_name' => 'Martinez',
            'maiden_name' => 'Anderson',
            'gender' => 'female',
            'date_of_birth' => '1978-10-30',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'Graphic Designer',
            'nationality' => 'American',
            'bio' => 'Sarah runs her own design studio. She is passionate about Scandinavian design and has visited Sweden multiple times.',
            'tree_position_x' => 600,
            'tree_position_y' => 400,
        ]);

        $carlosMartinez = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Carlos',
            'middle_name' => 'Alberto',
            'last_name' => 'Martinez',
            'gender' => 'male',
            'date_of_birth' => '1976-05-05',
            'birth_place' => 'Austin, Texas',
            'is_living' => true,
            'occupation' => 'Chef / Restaurant Owner',
            'nationality' => 'American',
            'bio' => 'Carlos owns a popular fusion restaurant combining Scandinavian and Latin American cuisines.',
            'tree_position_x' => 900,
            'tree_position_y' => 400,
        ]);

        $ericJohansson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Eric',
            'last_name' => 'Johansson',
            'gender' => 'male',
            'date_of_birth' => '1980-01-10',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'Pilot',
            'nationality' => 'American',
            'bio' => 'Eric is a commercial airline pilot who has flown to over 60 countries.',
            'tree_position_x' => 1200,
            'tree_position_y' => 400,
        ]);

        // ── Generation 4 (Children) ───────────────────────────────
        $emmaAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Emma',
            'middle_name' => 'Li',
            'last_name' => 'Anderson',
            'gender' => 'female',
            'date_of_birth' => '2003-04-17',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'Medical Student',
            'nationality' => 'American',
            'bio' => 'Emma is studying medicine at Johns Hopkins, inspired by her mother and great-grandmother.',
            'tree_position_x' => 0,
            'tree_position_y' => 600,
        ]);

        $alexAnderson = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Alexander',
            'nickname' => 'Alex',
            'middle_name' => 'Wei',
            'last_name' => 'Anderson',
            'gender' => 'male',
            'date_of_birth' => '2006-09-03',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'College Student',
            'nationality' => 'American',
            'bio' => 'Alex is studying computer science at MIT, following in his father\'s footsteps.',
            'tree_position_x' => 300,
            'tree_position_y' => 600,
        ]);

        $sofiaM = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Sofia',
            'last_name' => 'Martinez',
            'gender' => 'female',
            'date_of_birth' => '2005-12-01',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'High School Student',
            'nationality' => 'American',
            'tree_position_x' => 600,
            'tree_position_y' => 600,
        ]);

        $lucasM = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Lucas',
            'last_name' => 'Martinez',
            'gender' => 'male',
            'date_of_birth' => '2008-06-20',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'High School Student',
            'nationality' => 'American',
            'tree_position_x' => 900,
            'tree_position_y' => 600,
        ]);

        $oscarJ = Person::create([
            'family_tree_id' => $tree1->id,
            'first_name' => 'Oscar',
            'last_name' => 'Johansson',
            'gender' => 'male',
            'date_of_birth' => '2010-03-14',
            'birth_place' => 'Minneapolis, Minnesota',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'American',
            'tree_position_x' => 1200,
            'tree_position_y' => 600,
        ]);

        // ── Relationships ──────────────────────────────────────────

        // Gen 1: Erik & Ingrid are spouses
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $erikAnderson->id,
            'person2_id' => $ingridAnderson->id,
            'type' => 'spouse',
            'start_date' => '1946-06-15',
            'start_place' => 'Minneapolis, Minnesota',
        ]);

        // Gen 1 → Gen 2: Erik & Ingrid are parents of Robert and Helen
        foreach ([$robertAnderson, $helenAnderson] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $erikAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $ingridAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gen 2: Robert & Margaret, Helen & Karl
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $robertAnderson->id,
            'person2_id' => $margaretAnderson->id,
            'type' => 'spouse',
            'start_date' => '1974-09-21',
            'start_place' => 'Chicago, Illinois',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $helenAnderson->id,
            'person2_id' => $karlJohansson->id,
            'type' => 'spouse',
            'start_date' => '1977-06-10',
            'start_place' => 'Minneapolis, Minnesota',
        ]);

        // Gen 2 → Gen 3: Robert & Margaret's children
        foreach ([$davidAnderson, $sarahAnderson] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $robertAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $margaretAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Helen & Karl's child
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $helenAnderson->id,
            'person2_id' => $ericJohansson->id,
            'type' => 'parent_child',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $karlJohansson->id,
            'person2_id' => $ericJohansson->id,
            'type' => 'parent_child',
        ]);

        // Gen 3: David & Lisa, Sarah & Carlos
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $davidAnderson->id,
            'person2_id' => $lisaAnderson->id,
            'type' => 'spouse',
            'start_date' => '2001-07-04',
            'start_place' => 'Napa Valley, California',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $sarahAnderson->id,
            'person2_id' => $carlosMartinez->id,
            'type' => 'spouse',
            'start_date' => '2004-05-22',
            'start_place' => 'Austin, Texas',
        ]);

        // Gen 3 → Gen 4: David & Lisa's children
        foreach ([$emmaAnderson, $alexAnderson] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $davidAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $lisaAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Sarah & Carlos's children
        foreach ([$sofiaM, $lucasM] as $child) {
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $sarahAnderson->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree1->id,
                'person1_id' => $carlosMartinez->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Helen & Karl → Oscar (Eric's son, but let's make Eric's too)
        // Actually Oscar is Eric's son — Eric is unmarried for now
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $ericJohansson->id,
            'person2_id' => $oscarJ->id,
            'type' => 'parent_child',
        ]);

        // Siblings
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $robertAnderson->id,
            'person2_id' => $helenAnderson->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $davidAnderson->id,
            'person2_id' => $sarahAnderson->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $emmaAnderson->id,
            'person2_id' => $alexAnderson->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree1->id,
            'person1_id' => $sofiaM->id,
            'person2_id' => $lucasM->id,
            'type' => 'sibling',
        ]);

        // ── Life Events ────────────────────────────────────────────
        $this->createLifeEvents($erikAnderson, [
            ['type' => 'birth', 'title' => 'Born in Gothenburg', 'event_date' => '1920-03-15', 'event_place' => 'Gothenburg, Sweden'],
            ['type' => 'immigration', 'title' => 'Emigrated to America', 'description' => 'Crossed the Atlantic aboard the MS Gripsholm after WWII ended.', 'event_date' => '1945-09-10', 'event_place' => 'New York, New York'],
            ['type' => 'marriage', 'title' => 'Married Ingrid Lindqvist', 'event_date' => '1946-06-15', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'occupation', 'title' => 'Started Anderson Carpentry', 'description' => 'Founded his own carpentry workshop.', 'event_date' => '1948-03-01', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'retirement', 'title' => 'Retired from carpentry', 'event_date' => '1985-06-30', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'death', 'title' => 'Passed away peacefully', 'event_date' => '1998-11-02', 'event_place' => 'Minneapolis, Minnesota'],
        ]);

        $this->createLifeEvents($ingridAnderson, [
            ['type' => 'birth', 'title' => 'Born in Stockholm', 'event_date' => '1922-07-08', 'event_place' => 'Stockholm, Sweden'],
            ['type' => 'immigration', 'title' => 'Emigrated to America', 'event_date' => '1945-09-10', 'event_place' => 'New York, New York'],
            ['type' => 'marriage', 'title' => 'Married Erik Anderson', 'event_date' => '1946-06-15', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'occupation', 'title' => 'Started nursing career', 'description' => 'Began working at Hennepin County Medical Center.', 'event_date' => '1947-01-15', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'retirement', 'title' => 'Retired from nursing', 'event_date' => '1987-12-31', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'death', 'title' => 'Passed away', 'event_date' => '2005-01-20', 'event_place' => 'Minneapolis, Minnesota'],
        ]);

        $this->createLifeEvents($robertAnderson, [
            ['type' => 'birth', 'title' => 'Born', 'event_date' => '1948-06-12', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'education', 'title' => 'PhD in History', 'description' => 'Completed doctoral studies at the University of Minnesota.', 'event_date' => '1975-05-15', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'marriage', 'title' => 'Married Margaret O\'Brien', 'event_date' => '1974-09-21', 'event_place' => 'Chicago, Illinois'],
            ['type' => 'occupation', 'title' => 'Appointed Professor', 'description' => 'Became tenured professor at the University of Minnesota.', 'event_date' => '1982-09-01', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'retirement', 'title' => 'Retired from University', 'event_date' => '2015-06-30', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'death', 'title' => 'Passed away', 'event_date' => '2020-09-15', 'event_place' => 'St. Paul, Minnesota'],
        ]);

        $this->createLifeEvents($davidAnderson, [
            ['type' => 'birth', 'title' => 'Born on Valentine\'s Day', 'event_date' => '1975-02-14', 'event_place' => 'St. Paul, Minnesota'],
            ['type' => 'education', 'title' => 'BS in Computer Science', 'description' => 'Graduated from Stanford University.', 'event_date' => '1997-06-15', 'event_place' => 'Stanford, California'],
            ['type' => 'marriage', 'title' => 'Married Lisa Chen', 'event_date' => '2001-07-04', 'event_place' => 'Napa Valley, California'],
            ['type' => 'occupation', 'title' => 'Promoted to Software Architect', 'event_date' => '2010-03-01', 'event_place' => 'Minneapolis, Minnesota'],
        ]);

        $this->createLifeEvents($emmaAnderson, [
            ['type' => 'birth', 'title' => 'Born', 'event_date' => '2003-04-17', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'graduation', 'title' => 'High School Valedictorian', 'description' => 'Graduated top of her class.', 'event_date' => '2021-06-10', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'education', 'title' => 'Started Medical School', 'description' => 'Enrolled at Johns Hopkins School of Medicine.', 'event_date' => '2025-08-25', 'event_place' => 'Baltimore, Maryland'],
        ]);

        $this->createLifeEvents($sarahAnderson, [
            ['type' => 'birth', 'title' => 'Born', 'event_date' => '1978-10-30', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'education', 'title' => 'BFA in Graphic Design', 'event_date' => '2000-05-20', 'event_place' => 'Minneapolis, Minnesota'],
            ['type' => 'marriage', 'title' => 'Married Carlos Martinez', 'event_date' => '2004-05-22', 'event_place' => 'Austin, Texas'],
            ['type' => 'occupation', 'title' => 'Founded design studio', 'description' => 'Launched Nordic Design Co., specializing in Scandinavian-inspired branding.', 'event_date' => '2008-01-15', 'event_place' => 'Minneapolis, Minnesota'],
        ]);

        // ── Comments ───────────────────────────────────────────────
        Comment::create([
            'person_id' => $erikAnderson->id,
            'user_id' => $user->id,
            'body' => 'I found grandpa Erik\'s original immigration papers in the attic! The ship manifest shows he departed from Gothenburg on August 28, 1945.',
        ]);

        Comment::create([
            'person_id' => $erikAnderson->id,
            'user_id' => $user->id,
            'body' => 'According to Uncle Robert\'s research notes, Erik\'s father was a fisherman in Gothenburg. We should try to trace that branch further back.',
        ]);

        Comment::create([
            'person_id' => $ingridAnderson->id,
            'user_id' => $user->id,
            'body' => 'Grandma Ingrid\'s nursing diploma from 1944 is framed in Mom\'s house. She trained in Stockholm before emigrating.',
        ]);

        Comment::create([
            'person_id' => $robertAnderson->id,
            'user_id' => $user->id,
            'body' => 'Dad\'s three books are: "Waves of Change" (1990), "Nordic Roots" (2001), and "The Swedish Dream" (2012). We should add these to his profile.',
        ]);

        // ── Family Tree 2: The Williams Family (smaller tree) ──────
        $tree2 = FamilyTree::create([
            'name' => 'The Williams Family',
            'description' => 'Three generations of the Williams family from Georgia.',
            'owner_id' => $user->id,
            'privacy' => 'private',
        ]);

        $jamesW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'James',
            'last_name' => 'Williams',
            'gender' => 'male',
            'date_of_birth' => '1940-08-15',
            'birth_place' => 'Atlanta, Georgia',
            'date_of_death' => '2018-03-22',
            'death_place' => 'Savannah, Georgia',
            'is_living' => false,
            'occupation' => 'Jazz Musician',
            'bio' => 'James was a renowned jazz saxophonist who performed at clubs across the South.',
            'tree_position_x' => 0,
            'tree_position_y' => 0,
        ]);

        $dorisW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Doris',
            'last_name' => 'Williams',
            'maiden_name' => 'Jackson',
            'gender' => 'female',
            'date_of_birth' => '1942-11-05',
            'birth_place' => 'Savannah, Georgia',
            'is_living' => true,
            'occupation' => 'Retired School Principal',
            'bio' => 'Doris served as principal of Savannah High for 20 years.',
            'tree_position_x' => 300,
            'tree_position_y' => 0,
        ]);

        $michaelW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Michael',
            'last_name' => 'Williams',
            'gender' => 'male',
            'date_of_birth' => '1968-02-28',
            'birth_place' => 'Savannah, Georgia',
            'is_living' => true,
            'occupation' => 'Architect',
            'bio' => 'Michael designs sustainable buildings and has won several green architecture awards.',
            'tree_position_x' => 0,
            'tree_position_y' => 200,
        ]);

        $patriciaW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Patricia',
            'last_name' => 'Williams',
            'maiden_name' => 'Taylor',
            'gender' => 'female',
            'date_of_birth' => '1970-07-12',
            'birth_place' => 'Charleston, South Carolina',
            'is_living' => true,
            'occupation' => 'Attorney',
            'tree_position_x' => 300,
            'tree_position_y' => 200,
        ]);

        $amandaW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Amanda',
            'last_name' => 'Williams',
            'gender' => 'female',
            'date_of_birth' => '1970-06-18',
            'birth_place' => 'Savannah, Georgia',
            'is_living' => true,
            'occupation' => 'Music Teacher',
            'bio' => 'Amanda inherited her father\'s love of music and teaches at the local conservatory.',
            'tree_position_x' => 600,
            'tree_position_y' => 200,
        ]);

        $jadenW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Jaden',
            'last_name' => 'Williams',
            'gender' => 'male',
            'date_of_birth' => '1998-04-10',
            'birth_place' => 'Atlanta, Georgia',
            'is_living' => true,
            'occupation' => 'Musician / Producer',
            'tree_position_x' => 0,
            'tree_position_y' => 400,
        ]);

        $zoeyW = Person::create([
            'family_tree_id' => $tree2->id,
            'first_name' => 'Zoey',
            'last_name' => 'Williams',
            'gender' => 'female',
            'date_of_birth' => '2001-12-25',
            'birth_place' => 'Atlanta, Georgia',
            'is_living' => true,
            'occupation' => 'College Student',
            'tree_position_x' => 300,
            'tree_position_y' => 400,
        ]);

        // Williams relationships
        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $jamesW->id,
            'person2_id' => $dorisW->id,
            'type' => 'spouse',
            'start_date' => '1965-06-20',
            'start_place' => 'Savannah, Georgia',
        ]);

        foreach ([$michaelW, $amandaW] as $child) {
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $jamesW->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $dorisW->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $michaelW->id,
            'person2_id' => $amandaW->id,
            'type' => 'sibling',
        ]);

        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $michaelW->id,
            'person2_id' => $patriciaW->id,
            'type' => 'spouse',
            'start_date' => '1995-10-14',
            'start_place' => 'Charleston, South Carolina',
        ]);

        foreach ([$jadenW, $zoeyW] as $child) {
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $michaelW->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree2->id,
                'person1_id' => $patriciaW->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        Relationship::create([
            'family_tree_id' => $tree2->id,
            'person1_id' => $jadenW->id,
            'person2_id' => $zoeyW->id,
            'type' => 'sibling',
        ]);

        $this->createLifeEvents($jamesW, [
            ['type' => 'birth', 'title' => 'Born in Atlanta', 'event_date' => '1940-08-15', 'event_place' => 'Atlanta, Georgia'],
            ['type' => 'occupation', 'title' => 'First jazz club performance', 'description' => 'Debuted at The Blue Note in Atlanta.', 'event_date' => '1960-05-10', 'event_place' => 'Atlanta, Georgia'],
            ['type' => 'marriage', 'title' => 'Married Doris Jackson', 'event_date' => '1965-06-20', 'event_place' => 'Savannah, Georgia'],
            ['type' => 'death', 'title' => 'Passed away', 'event_date' => '2018-03-22', 'event_place' => 'Savannah, Georgia'],
        ]);

        // ── Collaborator on Tree 1 ─────────────────────────────────
        \App\Models\TreeCollaborator::create([
            'family_tree_id' => $tree1->id,
            'user_id' => $user2->id,
            'role' => 'editor',
        ]);

        // ── Activity Log entries ───────────────────────────────────
        \App\Models\ActivityLog::create([
            'family_tree_id' => $tree1->id,
            'user_id' => $user->id,
            'action' => 'created',
            'subject_type' => 'FamilyTree',
            'subject_id' => $tree1->id,
            'description' => 'Created the Anderson Family tree',
        ]);

        \App\Models\ActivityLog::create([
            'family_tree_id' => $tree1->id,
            'user_id' => $user->id,
            'action' => 'created',
            'subject_type' => 'Person',
            'subject_id' => $erikAnderson->id,
            'description' => 'Added Erik Anderson to the tree',
        ]);

        \App\Models\ActivityLog::create([
            'family_tree_id' => $tree1->id,
            'user_id' => $user2->id,
            'action' => 'updated',
            'subject_type' => 'Person',
            'subject_id' => $ingridAnderson->id,
            'description' => 'Updated Ingrid Anderson\'s biography',
        ]);

        // ═══════════════════════════════════════════════════════════
        // ── Family Tree 3: The Sharma Family (Nepali) ──────────────
        // ═══════════════════════════════════════════════════════════

        $nepaliUser = User::create([
            'name' => 'Rajesh Sharma',
            'email' => 'rajesh@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $tree3 = FamilyTree::create([
            'name' => 'शर्मा परिवार (Sharma Family)',
            'description' => 'Four generations of the Sharma family from Kathmandu, Nepal — tracing roots from a Brahmin priestly lineage in Gorkha to modern life in the Kathmandu Valley.',
            'owner_id' => $nepaliUser->id,
            'privacy' => 'private',
        ]);

        // ── Generation 1 (Great-grandparents) ──────────────────────
        $hari = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Hari Prasad',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1930-01-14',
            'birth_place' => 'Gorkha, Nepal',
            'date_of_death' => '2005-04-12',
            'death_place' => 'Kathmandu, Nepal',
            'is_living' => false,
            'occupation' => 'Purohit (Priest)',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'bio' => 'Hari Prasad was a respected Brahmin priest in Gorkha district. He performed religious ceremonies across the region and was known for his deep knowledge of Vedic scriptures. He moved to Kathmandu in the 1970s.',
            'tree_position_x' => 0,
            'tree_position_y' => 0,
        ]);

        $saraswati = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Saraswati',
            'last_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '1935-08-20',
            'birth_place' => 'Gorkha, Nepal',
            'date_of_death' => '2012-12-05',
            'death_place' => 'Kathmandu, Nepal',
            'is_living' => false,
            'occupation' => 'Homemaker',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'bio' => 'Saraswati Devi was known for her exceptional cooking and hospitality. She raised five children and was the heart of the Sharma household in Baneshwor.',
            'tree_position_x' => 300,
            'tree_position_y' => 0,
        ]);

        // ── Generation 2 (Grandparents) ────────────────────────────
        $krishna = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Krishna Bahadur',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1955-11-15',
            'birth_place' => 'Gorkha, Nepal',
            'is_living' => true,
            'occupation' => 'Retired Government Officer',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'bio' => 'Krishna Bahadur served as a Section Officer at the Ministry of Education for 30 years. He is an avid reader of Nepali literature and enjoys gardening at his home in Koteshwor.',
            'tree_position_x' => 0,
            'tree_position_y' => 200,
        ]);

        $laxmi = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Laxmi',
            'last_name' => 'Sharma',
            'maiden_name' => 'Adhikari',
            'gender' => 'female',
            'date_of_birth' => '1958-03-08',
            'birth_place' => 'Pokhara, Nepal',
            'is_living' => true,
            'occupation' => 'Retired School Teacher',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'bio' => 'Laxmi taught Nepali language at Kanya Mandir School for 28 years. She is passionate about Nepali folk music and still participates in bhajan groups.',
            'tree_position_x' => 300,
            'tree_position_y' => 200,
        ]);

        $gopal = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Gopal',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1958-06-01',
            'birth_place' => 'Gorkha, Nepal',
            'is_living' => true,
            'occupation' => 'Retired Army Officer',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'bio' => 'Gopal served in the Nepal Army for 25 years and retired as a Major. He now runs a small farm in Chitwan.',
            'tree_position_x' => 600,
            'tree_position_y' => 200,
        ]);

        $kamala = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Kamala',
            'last_name' => 'Sharma',
            'maiden_name' => 'Poudel',
            'gender' => 'female',
            'date_of_birth' => '1962-09-25',
            'birth_place' => 'Chitwan, Nepal',
            'is_living' => true,
            'occupation' => 'Homemaker / Farmer',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'tree_position_x' => 900,
            'tree_position_y' => 200,
        ]);

        $sita = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Sita',
            'last_name' => 'Thapa',
            'maiden_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '1960-02-14',
            'birth_place' => 'Gorkha, Nepal',
            'is_living' => true,
            'occupation' => 'Retired Nurse',
            'nationality' => 'Nepali',
            'religion' => 'Hindu',
            'bio' => 'Sita was one of the first female nurses from Gorkha district. She worked at Bir Hospital for over 20 years.',
            'tree_position_x' => 1200,
            'tree_position_y' => 200,
        ]);

        // ── Generation 3 (Parents) ────────────────────────────────
        $rajesh = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Rajesh',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1982-07-18',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Software Engineer',
            'nationality' => 'Nepali',
            'email' => 'rajesh.sharma@email.com',
            'phone' => '+977-9841000001',
            'bio' => 'Rajesh is a senior software engineer at a tech company in Kathmandu. He studied at Tribhuvan University and later completed his Masters in IT from Kathmandu University.',
            'tree_position_x' => 0,
            'tree_position_y' => 400,
        ]);

        $anita = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Anita',
            'last_name' => 'Sharma',
            'maiden_name' => 'Basnet',
            'gender' => 'female',
            'date_of_birth' => '1985-12-03',
            'birth_place' => 'Lalitpur, Nepal',
            'is_living' => true,
            'occupation' => 'Doctor (Gynecologist)',
            'nationality' => 'Nepali',
            'email' => 'anita.sharma@email.com',
            'bio' => 'Anita is a gynecologist at Patan Hospital. She completed her MBBS from IOM and MD from BPKIHS. She is passionate about maternal healthcare in rural Nepal.',
            'tree_position_x' => 300,
            'tree_position_y' => 400,
        ]);

        $sunil = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Sunil',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1985-04-14',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Civil Engineer',
            'nationality' => 'Nepali',
            'bio' => 'Sunil works as a civil engineer specializing in earthquake-resistant construction. He was actively involved in post-2015 earthquake reconstruction.',
            'tree_position_x' => 600,
            'tree_position_y' => 400,
        ]);

        $meena = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Meena',
            'last_name' => 'Sharma',
            'maiden_name' => 'Gurung',
            'gender' => 'female',
            'date_of_birth' => '1988-10-20',
            'birth_place' => 'Pokhara, Nepal',
            'is_living' => true,
            'occupation' => 'Hotel Manager',
            'nationality' => 'Nepali',
            'bio' => 'Meena manages a boutique hotel near Phewa Lake in Pokhara. She studied hospitality management in Kathmandu.',
            'tree_position_x' => 900,
            'tree_position_y' => 400,
        ]);

        $priya = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Priya',
            'last_name' => 'Karki',
            'maiden_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '1987-05-09',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Banker',
            'nationality' => 'Nepali',
            'bio' => 'Priya works as an assistant manager at Nepal Rastra Bank. She is the eldest daughter of Krishna and Laxmi.',
            'tree_position_x' => 1200,
            'tree_position_y' => 400,
        ]);

        $bikash = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Bikash',
            'last_name' => 'Karki',
            'gender' => 'male',
            'date_of_birth' => '1984-08-11',
            'birth_place' => 'Bhaktapur, Nepal',
            'is_living' => true,
            'occupation' => 'Architect',
            'nationality' => 'Nepali',
            'tree_position_x' => 1500,
            'tree_position_y' => 400,
        ]);

        $deepak = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Deepak',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '1990-01-26',
            'birth_place' => 'Chitwan, Nepal',
            'is_living' => true,
            'occupation' => 'Trekking Guide / Entrepreneur',
            'nationality' => 'Nepali',
            'bio' => 'Deepak runs a trekking agency in Pokhara and has summited several Himalayan peaks including Mera Peak and Island Peak.',
            'tree_position_x' => 1800,
            'tree_position_y' => 400,
        ]);

        // ── Generation 4 (Children) ───────────────────────────────
        $aarav = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Aarav',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '2010-09-15',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'Nepali',
            'bio' => 'Aarav studies at Budhanilkantha School. He loves football and robotics.',
            'tree_position_x' => 0,
            'tree_position_y' => 600,
        ]);

        $aanya = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Aanya',
            'last_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '2013-03-08',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'Nepali',
            'bio' => 'Aanya is passionate about Nepali classical dance and has won several competitions.',
            'tree_position_x' => 300,
            'tree_position_y' => 600,
        ]);

        $arjun = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Arjun',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '2012-11-20',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'Nepali',
            'tree_position_x' => 600,
            'tree_position_y' => 600,
        ]);

        $nisha = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Nisha',
            'last_name' => 'Sharma',
            'gender' => 'female',
            'date_of_birth' => '2015-06-10',
            'birth_place' => 'Pokhara, Nepal',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'Nepali',
            'tree_position_x' => 900,
            'tree_position_y' => 600,
        ]);

        $ayush = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Ayush',
            'last_name' => 'Karki',
            'gender' => 'male',
            'date_of_birth' => '2011-01-01',
            'birth_place' => 'Bhaktapur, Nepal',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'Nepali',
            'tree_position_x' => 1200,
            'tree_position_y' => 600,
        ]);

        $saanvi = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Saanvi',
            'last_name' => 'Karki',
            'gender' => 'female',
            'date_of_birth' => '2014-08-19',
            'birth_place' => 'Kathmandu, Nepal',
            'is_living' => true,
            'occupation' => 'Student',
            'nationality' => 'Nepali',
            'tree_position_x' => 1500,
            'tree_position_y' => 600,
        ]);

        $rohan = Person::create([
            'family_tree_id' => $tree3->id,
            'first_name' => 'Rohan',
            'last_name' => 'Sharma',
            'gender' => 'male',
            'date_of_birth' => '2018-04-14',
            'birth_place' => 'Pokhara, Nepal',
            'is_living' => true,
            'occupation' => 'Child',
            'nationality' => 'Nepali',
            'tree_position_x' => 1800,
            'tree_position_y' => 600,
        ]);

        // ── Sharma Relationships ───────────────────────────────────

        // Gen 1: Hari Prasad & Saraswati
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $hari->id,
            'person2_id' => $saraswati->id,
            'type' => 'spouse',
            'start_date' => '1952-02-20',
            'start_place' => 'Gorkha, Nepal',
        ]);

        // Gen 1 → Gen 2: Children of Hari & Saraswati
        foreach ([$krishna, $gopal, $sita] as $child) {
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $hari->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $saraswati->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Siblings gen 2
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $krishna->id,
            'person2_id' => $gopal->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $krishna->id,
            'person2_id' => $sita->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $gopal->id,
            'person2_id' => $sita->id,
            'type' => 'sibling',
        ]);

        // Gen 2 spouses
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $krishna->id,
            'person2_id' => $laxmi->id,
            'type' => 'spouse',
            'start_date' => '1978-11-28',
            'start_place' => 'Kathmandu, Nepal',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $gopal->id,
            'person2_id' => $kamala->id,
            'type' => 'spouse',
            'start_date' => '1982-05-15',
            'start_place' => 'Chitwan, Nepal',
        ]);

        // Gen 2 → Gen 3: Krishna & Laxmi's children
        foreach ([$rajesh, $sunil, $priya] as $child) {
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $krishna->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $laxmi->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Gopal & Kamala's child
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $gopal->id,
            'person2_id' => $deepak->id,
            'type' => 'parent_child',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $kamala->id,
            'person2_id' => $deepak->id,
            'type' => 'parent_child',
        ]);

        // Gen 3 siblings
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $rajesh->id,
            'person2_id' => $sunil->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $rajesh->id,
            'person2_id' => $priya->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $sunil->id,
            'person2_id' => $priya->id,
            'type' => 'sibling',
        ]);

        // Gen 3 spouses
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $rajesh->id,
            'person2_id' => $anita->id,
            'type' => 'spouse',
            'start_date' => '2008-02-14',
            'start_place' => 'Kathmandu, Nepal',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $sunil->id,
            'person2_id' => $meena->id,
            'type' => 'spouse',
            'start_date' => '2012-12-12',
            'start_place' => 'Pokhara, Nepal',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $priya->id,
            'person2_id' => $bikash->id,
            'type' => 'spouse',
            'start_date' => '2010-06-20',
            'start_place' => 'Bhaktapur, Nepal',
        ]);

        // Gen 3 → Gen 4: Rajesh & Anita's children
        foreach ([$aarav, $aanya] as $child) {
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $rajesh->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $anita->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Sunil & Meena's children
        foreach ([$arjun, $nisha] as $child) {
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $sunil->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $meena->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Priya & Bikash's children
        foreach ([$ayush, $saanvi] as $child) {
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $priya->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
            Relationship::create([
                'family_tree_id' => $tree3->id,
                'person1_id' => $bikash->id,
                'person2_id' => $child->id,
                'type' => 'parent_child',
            ]);
        }

        // Deepak's child (single parent for now)
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $deepak->id,
            'person2_id' => $rohan->id,
            'type' => 'parent_child',
        ]);

        // Gen 4 siblings
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $aarav->id,
            'person2_id' => $aanya->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $arjun->id,
            'person2_id' => $nisha->id,
            'type' => 'sibling',
        ]);
        Relationship::create([
            'family_tree_id' => $tree3->id,
            'person1_id' => $ayush->id,
            'person2_id' => $saanvi->id,
            'type' => 'sibling',
        ]);

        // ── Sharma Life Events ─────────────────────────────────────
        $this->createLifeEvents($hari, [
            ['type' => 'birth', 'title' => 'Born in Gorkha', 'event_date' => '1930-01-14', 'event_place' => 'Gorkha, Nepal'],
            ['type' => 'marriage', 'title' => 'Married Saraswati', 'event_date' => '1952-02-20', 'event_place' => 'Gorkha, Nepal'],
            ['type' => 'occupation', 'title' => 'Became head priest at Manakamana', 'description' => 'Appointed as the chief purohit for Manakamana temple ceremonies.', 'event_date' => '1960-04-01', 'event_place' => 'Manakamana, Gorkha'],
            ['type' => 'residence', 'title' => 'Moved to Kathmandu', 'description' => 'Relocated to Baneshwor, Kathmandu for children\'s education.', 'event_date' => '1972-07-15', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'death', 'title' => 'Passed away', 'event_date' => '2005-04-12', 'event_place' => 'Kathmandu, Nepal'],
        ]);

        $this->createLifeEvents($saraswati, [
            ['type' => 'birth', 'title' => 'Born in Gorkha', 'event_date' => '1935-08-20', 'event_place' => 'Gorkha, Nepal'],
            ['type' => 'marriage', 'title' => 'Married Hari Prasad', 'event_date' => '1952-02-20', 'event_place' => 'Gorkha, Nepal'],
            ['type' => 'death', 'title' => 'Passed away peacefully', 'event_date' => '2012-12-05', 'event_place' => 'Kathmandu, Nepal'],
        ]);

        $this->createLifeEvents($krishna, [
            ['type' => 'birth', 'title' => 'Born in Gorkha', 'event_date' => '1955-11-15', 'event_place' => 'Gorkha, Nepal'],
            ['type' => 'education', 'title' => 'SLC from Gorkha High School', 'event_date' => '1972-03-15', 'event_place' => 'Gorkha, Nepal'],
            ['type' => 'education', 'title' => 'BA from Tribhuvan University', 'event_date' => '1976-06-20', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'marriage', 'title' => 'Married Laxmi Adhikari', 'event_date' => '1978-11-28', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'occupation', 'title' => 'Joined Ministry of Education', 'description' => 'Started as Nayab Subba at the Ministry of Education.', 'event_date' => '1979-01-15', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'retirement', 'title' => 'Retired from government service', 'event_date' => '2015-11-15', 'event_place' => 'Kathmandu, Nepal'],
        ]);

        $this->createLifeEvents($rajesh, [
            ['type' => 'birth', 'title' => 'Born in Kathmandu', 'event_date' => '1982-07-18', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'education', 'title' => 'SLC from Galaxy Public School', 'event_date' => '1998-03-20', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'education', 'title' => 'BIT from Tribhuvan University', 'event_date' => '2004-07-01', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'education', 'title' => 'MIT from Kathmandu University', 'event_date' => '2007-12-15', 'event_place' => 'Dhulikhel, Nepal'],
            ['type' => 'marriage', 'title' => 'Married Anita Basnet', 'description' => 'Traditional Hindu wedding ceremony at Pashupatinath area.', 'event_date' => '2008-02-14', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'occupation', 'title' => 'Promoted to Senior Engineer', 'event_date' => '2015-04-01', 'event_place' => 'Kathmandu, Nepal'],
        ]);

        $this->createLifeEvents($anita, [
            ['type' => 'birth', 'title' => 'Born in Lalitpur', 'event_date' => '1985-12-03', 'event_place' => 'Lalitpur, Nepal'],
            ['type' => 'education', 'title' => 'MBBS from Institute of Medicine', 'event_date' => '2009-12-01', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'education', 'title' => 'MD from BPKIHS', 'event_date' => '2014-06-15', 'event_place' => 'Dharan, Nepal'],
            ['type' => 'occupation', 'title' => 'Joined Patan Hospital', 'event_date' => '2015-01-10', 'event_place' => 'Lalitpur, Nepal'],
        ]);

        $this->createLifeEvents($sunil, [
            ['type' => 'birth', 'title' => 'Born in Kathmandu', 'event_date' => '1985-04-14', 'event_place' => 'Kathmandu, Nepal'],
            ['type' => 'education', 'title' => 'BE Civil from Pulchowk Campus', 'event_date' => '2008-11-01', 'event_place' => 'Lalitpur, Nepal'],
            ['type' => 'marriage', 'title' => 'Married Meena Gurung', 'event_date' => '2012-12-12', 'event_place' => 'Pokhara, Nepal'],
            ['type' => 'other', 'title' => '2015 Earthquake relief work', 'description' => 'Led a team of engineers providing structural assessments in Sindhupalchowk after the devastating earthquake.', 'event_date' => '2015-05-01', 'event_place' => 'Sindhupalchowk, Nepal'],
        ]);

        // ── Sharma Comments ────────────────────────────────────────
        Comment::create([
            'person_id' => $hari->id,
            'user_id' => $nepaliUser->id,
            'body' => 'हजुरबुवाको मनकामना मन्दिरमा पुरोहितको रूपमा सेवा गरेको कुरा गाउँका धेरै बुढापाकाहरूले अझै सम्झिन्छन्। We should document more stories from Gorkha relatives.',
        ]);

        Comment::create([
            'person_id' => $saraswati->id,
            'user_id' => $nepaliUser->id,
            'body' => 'Hajurama\'s sel roti recipe is legendary. Meena bhauju has the handwritten recipe — we should photograph it and add to her profile.',
        ]);

        Comment::create([
            'person_id' => $krishna->id,
            'user_id' => $nepaliUser->id,
            'body' => 'Baba still has his appointment letter from the Ministry of Education dated 1979. Great piece of family history!',
        ]);

        Comment::create([
            'person_id' => $rajesh->id,
            'user_id' => $nepaliUser->id,
            'body' => 'Need to add photos from the Pashupatinath wedding ceremony. Priya didi might have the album.',
        ]);

        // ── Grant demo user access as collaborator ─────────────────
        \App\Models\TreeCollaborator::create([
            'family_tree_id' => $tree3->id,
            'user_id' => $user->id,
            'role' => 'viewer',
        ]);

        // ── Activity Logs ──────────────────────────────────────────
        \App\Models\ActivityLog::create([
            'family_tree_id' => $tree3->id,
            'user_id' => $nepaliUser->id,
            'action' => 'created',
            'subject_type' => 'FamilyTree',
            'subject_id' => $tree3->id,
            'description' => 'Created the Sharma Family tree',
        ]);

        \App\Models\ActivityLog::create([
            'family_tree_id' => $tree3->id,
            'user_id' => $nepaliUser->id,
            'action' => 'created',
            'subject_type' => 'Person',
            'subject_id' => $hari->id,
            'description' => 'Added Hari Prasad Sharma to the tree',
        ]);

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Login: demo@example.com / password');
        $this->command->info('Trees: "The Anderson Family" (18 members) + "The Williams Family" (8 members)');
        $this->command->info('Login: rajesh@example.com / password');
        $this->command->info('Trees: "शर्मा परिवार (Sharma Family)" (22 members, 4 generations)');
    }

    private function createLifeEvents(Person $person, array $events): void
    {
        foreach ($events as $i => $event) {
            LifeEvent::create(array_merge($event, [
                'person_id' => $person->id,
                'sort_order' => $i,
            ]));
        }
    }
}
