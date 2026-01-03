### 🔌 API Integration

1. Never call `axiosInstance` directly.
2. Use the abstraction methods from the `/api` layer:

   * `getRequest`
   * `postRequest`
   * `putRequest`
   * `deleteRequest`
3. **Follow exact request/response schemas.**

   * Do not reshape data unless explicitly instructed.
   * Don’t send extra fields or ignore required ones.

---
## Axios instance usage 
# Follow the steps below to use the axios instance with react query and do not modify the actual `axiosInstance` file 

### 1. Get request 
```js
import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from './axiosInstance';
import { useQuery, useMutation } from 'react-query';

const Component = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['get', '/endpoint'],
        queryFn: async () => await getRequest('/endpoint'),
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    ...
}

```

### 2. Post request

```js
import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from './axiosInstance';
import { useQuery, useMutation } from 'react-query';

const Component = () => {
    const { data, isLoading, error } = useMutation({
        mutationKey: ['post', '/endpoint'],
        mutationFn: async () => await postRequest('/endpoint'),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    ...
}

```

### 3. Patch request
```js
import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from './axiosInstance';
import { useQuery, useMutation } from 'react-query';

const Component = () => {
    const { data, isLoading, error } = useMutation({
        mutationKey: ['patch', '/endpoint'],
        mutationFn: async () => await patchRequest('/endpoint'),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    ...
}
```

### 4. Put request
```js
import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from './axiosInstance';
import { useQuery, useMutation } from 'react-query';

const Component = () => {
    const { data, isLoading, error } = useMutation({
        mutationKey: ['put', '/endpoint'],
        mutationFn: async () => await putRequest('/endpoint'),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    ...
}
```

### 5. Delete request
```js
import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from './axiosInstance';
import { useQuery, useMutation } from 'react-query';

const Component = () => {
    const { data, isLoading, error } = useMutation({
        mutationKey: ['delete', '/endpoint'],
        mutationFn: async () => await deleteRequest('/endpoint'),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    ...
}
```


