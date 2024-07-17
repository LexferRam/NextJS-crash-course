# NextJS Notes

* shortcut: cmd + p: search for files

**Project structure**
* app folder: is the container for our routing system.In NextJS our router is based in the file system, we simply create files and folders to represent our routes. It is based in convention not configuration.
The App Router is a new routing system that is built on top of RSCs and provides support for nested routes, layouts, loading states, error handling, and more
**NOTE:** if we create a folder inside a app folder and we dont create a page.tsx file inside that folder, we can't access that folder from the browser, we get a 404 error.

**Navigation**

* <Link> allow client side navigation between pages


### Rendering environments:
Next.js already has some clever ways to pre-render content efficiently. 

1. Client: within a web browser, is how reactJS works and we refer to it as CSR (Client Side Rendering)

2. Server: within a NodeJS runtime, is how NextJS works and we refer to it as SSR (Server Side Rendering)

Difference between CSR and SSR:

* CSR: 
    - Large bundles
    - resource intensive, because the browser has to download the bundle and then execute it
    - SEO: search engines can't index the page because the page is rendered in the browser.
    el SEO(Search Engine Optimization: es el posicionamiento en buscadores y optimizacion en motores de busqueda) no funciona en CSR porque los bots de los buscadores(motores que indexan y navegan nuestra web) no pueden ver el contenido de nuestra web y por lo tanto no pueden  indexar la pagina porque la renderiza en el navegador y éstos bots no pueden ejecutar javascript.
    - Less secure: because the code is exposed to the client, so the client can see the code and manipulate it.

* SSR: 
In server-side rendering (SSR), the data for your app is fetched on the server and HTML pages are generated for each route. These pages are then sent to the user’s browser. When the browser receives the pages, it executes JavaScript code on the client side to add interactivity to the HTML, a process commonly referred to as hydration.

This ensures that users see content as soon as they land on your page, rather than a blank white screen while external data is being fetched, which is often the case with single-page React apps.

if we render the components in the server we can get rid of the bundle and send the html to the client, so the client doesn't have to download the bundle and execute it. The client only has to download the html and css and that's it. This is more secure because the client can't see the code.
    - Smaller bundles: server send only esential code to the client
    - Resource efficient: server handles most of the rendering we need less resources on the client
    - SEO: because the server sends the html to the client, the bots can see the content and index the page.
    - More secure: because the code is not exposed to the client, we have sensitive data in the server and we don't want to expose it to the client.
  
    **NOTE 1:**with ser-side rendering we lose interactivity so server components wich are rendered in the server are not interactive.
    we cannot:
        - listen to browser event
        - access browser APIs
        - Maintain state
        - use effects

    So in real apps we need to combine both CSR and SSR, we need to render some components in the server and some components in the client(use client components only when we absolutly need them).

    **NOTE 2:** In NextJS, all the components inside the app folder are by default server components.

    **NOTE 3:** use 'use client' to render components in the client.

### Data fetching

1. Client: useState + useEffect, React Query
    - large bundles
    - resource intensive
    - No SEO
    - Less secure
    - Extra roundtrip to server

2. Server: we can fetch data in our server components and get rid of all this problems.
All the fecth occurs in the server. We can check "Network" tab to see the document that the server returns.

When we fetch data we should fetch it in server components.

```javascript
import React from 'react'

interface IUser {
    id: number,
    name: string,
}

const UsersPage = async () => {

    const resp = await fetch('https://jsonplaceholder.typicode.com/users')
    const data: IUser[] = await resp.json()

    return (
        <>
            <ul>
                {
                    data.map((user: IUser) => (
                        <li key={user.id}>
                            <p>{user.name}</p>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default UsersPage
```

### CACHING

fetching in server components has a extra benefit and that is caching. If we fetch data in server components, the server will cache the data and if we refresh the page the server will return the cached data. So we don't have to fetch the data again.

NextJS has a built-in caching system, so we don't have to worry about it.
Wheneever we fetch data in server components(using fetch), NextJS will cache the data and if we refresh the page the server will return the cached data(that is stored in the file system), so the next time we hit the same url, the server will return the data cached from the file system.

**NOTE:** we have full control of this cache behaviour, we can disable it or we can configure it.

this caching behaviour is only implemented for the fetch function, if we use axios or any other library, we have to implement the caching behaviour by ourself.

```javascript
    const resp = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
            // cache: 'no-store', // if data change frequetly
            next:{
                revalidate: 1 // revalidate after 10 seconds
            }
        })
```

### RENDERING ON SERVER-SIDE: Static(SSG) and Dinamic rendering(SSR) 

* **Static Rendering (Static Site Generation / render at build time):** is a technique where the server renders the page in build time and then sends the html to the client. So the client doesn't have to render the page, the server does it for us. This is a perfomance optimization technique.

```javascript
    const resp = await fetch(
        'https://jsonplaceholder.typicode.com/users') // fetch data in build time ==> SSG
```

* **Dynamic rendering (Server Side Rendering):** render at request time.
Server-side rendering (SSR) is an application’s ability to convert HTML files on the server into a fully rendered HTML page for the client.

```javascript
    const resp = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
            // cache: 'no-store', // if data change frequetly ==>  SSR
            next:{
                revalidate: 1 // revalidate after 10 seconds ==>  ISR
            }
        })
```

### Styling NextJS apps:

* Global styles
* CSS Modules: is a CSS that is scoped to a component/page, avoid style change or override the default styles of a component/page. 

    - Allow us to create clases that are scoped to our product card component.
    - Extention: [component-name].module.css
    - We can import the css file in the component and use the classes in the component. ie: **import styles from './product-card.module.css'**
    - We can use the classes in the component like this: **className={styles.card}**
    - the name of the classes must be in camelCase(because must be a valid JS property name), we cant use dashes or underscores.

* Tailwind CSS: popular CSS framework that uses the concept of utility classes
* Daisy UI: component library for tailwind CSS

### Server Components and Client Components

Now, there are two types of React components: Server Components and Client Components.
Any component that is placed within the App Router is considered a **Server Component** by default. Server Components are rendered on the server and then sent to the client as static HTML. **Client Components** are rendered on the client, as is conventionally done with React.

With the App Router, the **getStaticProps** and **getServerSideProps** methods are no longer preferred for passing data as props. Instead, a new native **fetch API** has been introduced. This API works in both Server and Client Components and supports **incremental static regeneration (ISR)** as well.

**Pre-rendering with React Server Components** 
RSCs don’t replace the existing rendering methods in Next.js, but they mix up well with both SSR and SSG to pre-render individual components on the server, which can improve performance and reduce the need for client-side JavaScript and high build times.

React Server Components offer a considerable number of advantages over traditional React components, with some of the main ones listed below:

* Enhanced performance: RSCs can significantly boost the performance of your Next.js app by reducing the browser’s workload. This improvement can lead to quicker loading times and smoother interactions
* Improved SEO: RSCs elevate the SEO of your Next.js apps by ensuring up-to-date and fast-loading pages. This, in turn, can lead to enhanced search performance for your application on search engines
* Increased flexibility: RSCs offer greater flexibility in how you render your Next.js applications. This flexibility allows you to create more dynamic and diverse content experiences

**NOTE:**
it’s important to note that you can’t directly import a Server Component into a Client Component.

If you need to nest a Server Component within a Client Component, you can elevate it to a higher-order component and pass it as a prop to the Client Component.

Here’s an example that illustrates the proper usage of Server Components within Client Components:

```javascript
const ClientComponent = ({ children }) => {
  ...

  return (
    <div className="...">
      {children}
    </div> 
  );
};

export default ClientComponent;
```

We can now import the ClientComponent component into a server or a route component as we normally would and provide it with another Server Component as its child, as shown in the code below:

```javascript
import ClientComponent from "./ClientComponent";
import NestedServerComponent from "./NestedServerComponent";

const Index = () => {
  ...

  return (
    <ClientComponent>
      <NestedServerComponent/>
    </ClientComponent>
  );
};

export default Index;
```
