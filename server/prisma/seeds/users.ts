import { User } from "../types";

export const users: User[] = [
  {
    UserId: 1,
    FullName: "John Doe",
    Identification: "1234567890",
    PhoneNumber: "123456789",
    Email: "johndoe@example.com",
    Password: "password123",
    IsActive: true,
    Address: "123 Main Street",
  },
  {
    UserId: 2,
    FullName: "Jane Smith",
    Identification: "0987654321",
    PhoneNumber: "987654321",
    Email: "janesmith@example.com",
    Password: "password456",
    IsActive: true,
    Address: "456 Elm Street",
  },
  {
    UserId: 3,
    FullName: "Bob Johnson",
    Identification: "5678901234",
    PhoneNumber: "567890123",
    Email: "bobjohnson@example.com",
    Password: "password789",
    IsActive: true,
    Address: "789 Oak Street",
  },
  
];
