import qs from "qs";

interface SignInDataProps {
    email: string,
    password: string,
}

export const initialSignInFormData: SignInDataProps = {
    email: "",
    password: "",
}

interface SignUpDataProps {
    userName: string,
    email: string,
    password: string,
    role: string,
}

export const initialSignUpFormData: SignUpDataProps = {
    userName: "",
    email: "",
    password: "",
    role: "",
}

export const initialProductFormData = {
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: "",
    productImage: "",
}


export const filterMenuDataArray = [
    {
        id: "product name",
        label: "Product Name",
    },
    {
        id: "price",
        label: "Price",
    },
    {
        id: "category",
        label: "Category",
    },
    {
        id: "stock",
        label: "Stock",
    },
]

// export function formUrlQuery({ params, dataToAdd }: { params: any, dataToAdd: any }) {
//     let currentURL = qs.parse(params);

//     if (Object.keys(dataToAdd).length > 0) {
//         Object.keys(dataToAdd).map((key) => {
//             if (dataToAdd[key].length === 0) delete currentURL[key];
//             else currentURL[key] = dataToAdd[key].join(",");
//         });
//     }

//     return qs.stringify(
//         {
//             url: window.location.pathname,
//             query: currentURL,
//         },
//         {
//             skipNulls: true,
//         }
//     );
// }