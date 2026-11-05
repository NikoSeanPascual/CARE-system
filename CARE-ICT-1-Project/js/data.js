//ito yung userdata

const userDatabase = [
    {
        identifier: '102-48324',
        password: 'nikosean12345',
        name: 'Niko Sean Pascual',
        role: 'student',
        grade: 'Grade 11',
        section: 'ICT-1'
    },
    {
        identifier: 'staff61245',
        password: 'staff98234',
        name: 'Nurse Martinez',
        role: 'staff'
    },
    {
        identifier: 'admin01',
        password: 'admin123',
        name: 'Dr. Baculfo',
        role: 'admin'
    }
];

let currentUser = null;

let clinicVisits = [];