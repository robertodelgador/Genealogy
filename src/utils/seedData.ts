import type { FamilyTreeData, Person } from '../types';

function p(partial: Partial<Person> & Pick<Person, 'id' | 'firstName' | 'lastName' | 'gender'>): Person {
  return {
    parentIds: [],
    spouseIds: [],
    childIds: [],
    ...partial,
  };
}

// Three generations: grandparents -> parents -> children
const grandpa = p({ id: 'g1', firstName: 'Henry', lastName: 'Whitfield', gender: 'male', birthDate: '1932-03-14', deathDate: '2005-11-02', birthPlace: 'Boston, MA' });
const grandma = p({ id: 'g2', firstName: 'Eleanor', lastName: 'Whitfield', maidenName: 'Carter', gender: 'female', birthDate: '1935-07-22', deathDate: '2011-01-19', birthPlace: 'Providence, RI' });

const dad = p({ id: 'p1', firstName: 'Robert', lastName: 'Whitfield', gender: 'male', birthDate: '1958-05-10', birthPlace: 'Boston, MA' });
const mom = p({ id: 'p2', firstName: 'Susan', lastName: 'Whitfield', maidenName: 'Nguyen', gender: 'female', birthDate: '1960-09-03', birthPlace: 'Chicago, IL' });

const uncle = p({ id: 'p3', firstName: 'Michael', lastName: 'Whitfield', gender: 'male', birthDate: '1961-02-28', birthPlace: 'Boston, MA' });
const aunt = p({ id: 'p4', firstName: 'Karen', lastName: 'Whitfield', maidenName: 'Douglas', gender: 'female', birthDate: '1963-12-11' });

const me = p({ id: 'c1', firstName: 'Daniel', lastName: 'Whitfield', gender: 'male', birthDate: '1988-04-17', birthPlace: 'Chicago, IL' });
const sister = p({ id: 'c2', firstName: 'Emily', lastName: 'Whitfield', gender: 'female', birthDate: '1991-08-25' });
const cousin = p({ id: 'c3', firstName: 'James', lastName: 'Whitfield', gender: 'male', birthDate: '1990-06-06' });

const spouse = p({ id: 'c1s', firstName: 'Olivia', lastName: 'Whitfield', maidenName: 'Reyes', gender: 'female', birthDate: '1989-01-30' });
const grandchild = p({ id: 'c1c1', firstName: 'Sophie', lastName: 'Whitfield', gender: 'female', birthDate: '2018-10-05' });

grandpa.spouseIds = ['g2'];
grandma.spouseIds = ['g1'];
grandpa.childIds = ['p1', 'p3'];
grandma.childIds = ['p1', 'p3'];

dad.parentIds = ['g1', 'g2'];
dad.spouseIds = ['p2'];
dad.childIds = ['c1', 'c2'];

mom.spouseIds = ['p1'];
mom.childIds = ['c1', 'c2'];

uncle.parentIds = ['g1', 'g2'];
uncle.spouseIds = ['p4'];
uncle.childIds = ['c3'];

aunt.spouseIds = ['p3'];
aunt.childIds = ['c3'];

me.parentIds = ['p1', 'p2'];
me.spouseIds = ['c1s'];
me.childIds = ['c1c1'];

sister.parentIds = ['p1', 'p2'];

cousin.parentIds = ['p3', 'p4'];

spouse.spouseIds = ['c1'];
spouse.childIds = ['c1c1'];

grandchild.parentIds = ['c1', 'c1s'];

const people: Record<string, Person> = {
  g1: grandpa,
  g2: grandma,
  p1: dad,
  p2: mom,
  p3: uncle,
  p4: aunt,
  c1: me,
  c2: sister,
  c3: cousin,
  c1s: spouse,
  c1c1: grandchild,
};

export const seedData: FamilyTreeData = {
  people,
  rootId: 'g1',
};
