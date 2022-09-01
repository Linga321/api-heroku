import User from "../../src/models/User";

export const user1 = new User({
    firstName: "Linga",
    lastName: "Gaja",
    email: "linga@mail.com",
    password: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjEyMzQ1Ig.j_Z9FWlOwlH7nE1A9ij6eoFxidVvvZywn9UXZ2fiP4s",
    role: "Admin",
})

export const user2 = new User({
    firstName: "John",
    lastName: "Done",
    email: "John@mail.com",
    password: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjU0MzIxIg.4_3Sa_uszw06x-JuAvKOR2eJrW9I1cCn8w1Tw0e7a9A",
    role: "Customer",
    avatar: "/string.png",
    phone: "+3626002333",
})