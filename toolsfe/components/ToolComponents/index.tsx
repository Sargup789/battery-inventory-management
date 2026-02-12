import { Button, Typography } from "@mui/material"
import { useState } from "react";
import AddToolDialog from "./AddToolDialog";
import ToolTable from "./ToolTable"
import { FiltersState, ToolApiResponse, ToolData } from "@/pages/tools";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import xlsx from "json-as-xlsx"
import { toast } from "react-toastify";

type Props = {
  toolApidata: ToolApiResponse;
  deleteTool: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void
  setSize: (size: number) => void
  page: number
  size: number
  setFilterState: (values: any) => void;
  filtersState: FiltersState
};
const queryClient = new QueryClient();

const ToolIndex = ({ toolApidata, deleteTool, refetch, setPage, setSize, page, size, filtersState, setFilterState }: Props) => {
  const [addToolDialogOpen, setAddToolDialogOpen] = useState(false);
  const [toolDialogData, setToolDialogData] = useState<ToolData | {}>({});
  const [isViewMode, setIsViewMode] = useState(false);

  const fetchAllToolData = async () => {
    try {
      const response = await axios.get(`/api/router?path=api/tools&page=1&size=10000`);
      return response.data?.data;
    } catch (error) {
      console.error("Error fetching all tool data:", error);
      return [];
    }
  };

  const downloadFile = () => {
    let data = [
      {
        sheet: "Data",
        columns: [
          { label: "QR Code ID", value: 'qrCodeId' },
          { label: "Tool ID", value: 'toolId' },
          { label: "Part Number", value: 'partNumber' },
          { label: "Tool Name", value: 'toolName' },
          { label: "Tool Description", value: 'toolDescription' },
          { label: "Supplier", value: 'supplier' },
          { label: "Status", value: 'status' },
          { label: "Assigned Person", value: 'assignedPerson' },
          { label: "Assigned Location", value: 'assignedLocation' },
        ],
        content: toolApidata.data.map((data) => {
          return {
            qrCodeId: data.qrCodeId || "N/A",
            toolId: data.toolId || "N/A",
            partNumber: data.partNumber || "N/A",
            toolName: data.toolName || "N/A",
            toolDescription: data.toolDescription || "N/A",
            supplier: data.supplier || "N/A",
            status: data.status || "N/A",
            assignedPerson: data.assignedPerson || "N/A",
            assignedLocation: data.assignedLocation || "N/A"
          }
        })
      }
    ]
    let settings = {
      fileName: "ToolsData",
    }
    xlsx(data, settings)
  }

  const viewTool = (tool: ToolData) => {
    setToolDialogData(tool);
    setAddToolDialogOpen(true);
    setIsViewMode(true);
  }

  const editTool = (tool: ToolData) => {
    setToolDialogData(tool);
    setAddToolDialogOpen(true);
  };

  const handleClose = () => {
    setAddToolDialogOpen(false);
    setToolDialogData({});
    setIsViewMode(false);
  };

  const onSubmit = async (data: ToolData) => {
    if (Object.keys(toolDialogData).length > 0) {
      const { id, ...rest } = data;
      try {
        const response = await axios.put(
          `/api/router?path=api/tools/${id}`,
          rest
        );
        toast.success("Successfully updated truck");
        console.log(response.data);
      } catch (error: any) {
        const errmsg = error?.response?.data?.message;
        toast.error(errmsg || "Something went wrong");
      }
    } else {
      try {
        const response = await axios.post(`/api/router?path=api/tools`, data);
        toast.success("Successfully created tool");
      } catch (error: any) {
        const errmsg = error?.response?.data?.message;
        toast.error(errmsg || "Something went wrong");
      }
    }
    handleClose();
    refetch();
  };

  // Function to mark the tool as sold
  const markToolAsSold = async (tool: ToolData) => {
    try {
      const response = await axios.put(`/api/router?path=api/tools/${tool.id}`, {
        ...tool,
        status: "Sold"
      });
      toast.success("Tool marked as sold!");
      refetch(); // Refresh the data after updating
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to mark tool as sold.");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#9B2735",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setAddToolDialogOpen(true)}
          >
            Add Tool
          </Button>
        </div>
        <ToolTable
          toolApidata={toolApidata}
          deleteTool={deleteTool}
          editTool={editTool}
          viewTool={viewTool}
          setPage={setPage}
          markToolAsSold={markToolAsSold}
          setSize={setSize}
          page={page}
          size={size}
        />
        <AddToolDialog
          open={addToolDialogOpen}
          isViewMode={isViewMode}
          toolDialogData={toolDialogData}
          handleClose={handleClose}
          onSubmit={onSubmit}
        />
      </div>
    </QueryClientProvider>
  );
}

export default ToolIndex