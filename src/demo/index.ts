import { User, UserRole } from "@/types";
import { faker } from "@faker-js/faker";

export const makeArrayData = <T = unknown>(func: () => T) =>
  faker.helpers.multiple(func, { count: 10 });

export const getUser = (roleName?: UserRole): User => {
  const roles: string[] = ['evaluator', 'vendor', 'company_admin', 'super_admin', 'procurement'];
  const selectedRole = roleName || faker.helpers.arrayElement(roles) as UserRole;
  return {
    _id: faker.string.uuid(),
    companyId: {
      name: faker.string.uuid(),
      _id: faker.string.uuid()
    },
    createdAt: faker.date.past().toISOString(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: {
      _id: faker.string.uuid(),
      name: selectedRole,
      __v: 0
    },
    status: faker.helpers.arrayElement(['active', 'inactive', 'suspended']),
    updatedAt: faker.date.recent().toISOString(),
    isAi: true
  }
}

export const getToken = () => {
  return faker.string.uuid()
}

export { default as InactivityLogoutDemo } from './InactivityLogoutDemo';
export { ConfirmAlertDemo } from './ConfirmAlertDemo';
export { TextComboDemo } from './TextComboDemo';
