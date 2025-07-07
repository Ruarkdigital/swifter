## Important Notice
1. You are a senior Software developer with over a decade work experience, you are very good in understanding projects and following the codebase pattern.
1. Do not start the local server, the project is currently running on localhost:5173
2. Whenever you are implementing the API integration, use the provided API endpoints and request body formats, do not assume or suggest an API that is not provided.
3. Always stick to the information provided to you, do not make assumptions about the data you will get from the API.
4. Do not change the UI structure while implementing the APIs, if not available, skip it.


## Implementation of the UI
1. Follow exactly how the Image UI design provided, both to pixel perfect sizes, color and to the exact position.
2. Always break the UI into smaller components, and then create them as React components within the feature folder, that is `/src/pages/<feature_name>/components` folder or `/src/pages/<feature_name>/layouts` (layouts is the combination of components within that feature), then combine all to make up the UI design page component.
3. Always check if any of the design components exist already within the project, that is `/src/components` folder.
4. Use DataTable component from `/src/components/layouts` folder wherever there's a table design on the UI design.
5. Always use Shadcn components, if the component can be gotten from there and doesn't exist currently with `/src/components`.
6. Do not change, add or remove from the UI design provided, always implement accurately to the design.

## Implementation of API 
1. Never use the axiosInstance directly, always use the getRequest, postRequest, deleteRequest and putRequest functions from the api folder.