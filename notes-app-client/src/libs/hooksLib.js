import { useState } from "react";

/**
 * React Hooks - reusing stateful logic between components.
 * https://serverless-stack.com/chapters/create-a-custom-react-hook-to-handle-form-fields.html
 *
 * Creating a Custom React Hook
 * Creating a custom hook is amazingly simple. Let's go over how this works:
 *  1. A custom React Hook starts with the word use in its name. So ours is called useFormFields.
 *  2. Our Hook takes the initial state of our form fields as an object and saves it as a state variable called fields.
 *  3. It returns an array with fields and a function that sets the new state based on the event object.
 *     The only difference here is that we are using event.target.id (which contains the id of our form field) to store the value (event.target.value).
 *
 * And that’s it! We can now use this in our Login component.
 *
 * @param initialState
 * @returns {*[]}
 */
export function useFormFields(initialState) {
    const [fields, setValues] = useState(initialState);

    return [
        fields,
        function(event) {
            setValues({
                ...fields,
                [event.target.id]: event.target.value
            });
        }
    ];
}
