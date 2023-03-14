import {FileDropzone, FileUpload, requireNextAuth} from "@roq/nextjs";
import DashboardLayout from "../layout/dashboard.layout";

function DashboardPage() {
    return (
        <DashboardLayout current="files">


            <FileUpload
                accept={["image/*"]}
                fileCategory="USER_FILES"
                onUploadSuccess={({url, id, ...rest}) => {
                    console.log({id, url});
                    // optional: send file ID to server-side by calling your API
                }}
            />


            <div>
                <FileDropzone
                    accept={["image/*"]}
                    fileCategory="USER_FILES"
                    onUploadSuccess={(data, id) =>
                        console.log("(onUploadSuccess)", {data, id})
                    }
                    onFileEdit={(file) => console.log("(onFileEdit)", {file})}
                    onUploadFail={(err) => console.error("(onUploadFail)", err)}
                />
            </div>
        </DashboardLayout>
    );
}

// export default DashboardPage;
export default requireNextAuth({
    redirectIfAuthenticated: false,
    redirectTo: "/login",
})(DashboardPage);
