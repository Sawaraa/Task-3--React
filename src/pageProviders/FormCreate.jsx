

import PageContainer from "./components/PageContainer";
import FormCreatePage from "../pages/formCreate";

const FormCreate = (props) => {
    return (
        <PageContainer>
            <FormCreatePage {...props} />
        </PageContainer>
    );
};

export default FormCreate;