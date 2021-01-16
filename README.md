# Image Repository

> This is a Node.JS api for an image repository built for the Shopify Backend Developer Intern Challenge.

#### Features
- ADD image(s) to the repository
   - one/bulk/enormous amount of images
   - private/public (permissions)
   - secure uploads

- DELETE image(s)
   - one/bulk/selected/all images
   - access control
   - secure deletion

#### Usage
> Requires node v10+ and Postgres v9+
```shell
$ mkdir <folder>
$ cd <folder>
$ git clone https://Mayowa-Ojo/image-repository.git .
$ npm install
$ npm run start:dev
```

#### Endpoints
```js
// response format:
{
   ok: boolean,
   message: string,
   data: object
}

// auth
// sign up
POST - "/api/v1/auth/signup"
// login
POST - "/api/v1/auth/login"

// images
// upload image(s)
POST - "/api/v1/images"
headers - Authorization: "Bearer <token>"
        - ContentType: "multipart/formdata"

// edit permission
PATCH - "/api/v1/images/:id"
headers - Authorization: "Bearer <token>"
body - { permission: "<value>"}

// delete selected images
DELETE - "/api/v1/images?ids[]=<id1>&ids[]=<id2>ids[]=<id3>"
headers - Authorization: "Bearer <token>"

// delete all images
DELETE - "/api/v1/images/all"
headers - Authorization: "Bearer <token>"

// delete one image
DELETE - "/api/v1/images/:id"
headers - Authorization: "Bearer <token>"
```