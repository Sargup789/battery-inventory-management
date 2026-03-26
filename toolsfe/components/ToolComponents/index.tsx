import { Box, Button, Typography } from "@mui/material"
import { useState } from "react";
import { useTranslation } from 'next-i18next';
import AddToolDialog from "./AddToolDialog";
import ToolTable from "./ToolTable"
import { ToolApiResponse, ToolData, ToolFilters } from "@/pages/tools";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import ToolTableFilters from "./ToolTableFilters";

type Props = {
  toolApidata: ToolApiResponse;
  deleteTool: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
  filters: ToolFilters;
  onFiltersChange: (filters: ToolFilters) => void;
};
const queryClient = new QueryClient();

const ToolIndex = ({ toolApidata, deleteTool, refetch, setPage, setSize, page, size, filters, onFiltersChange }: Props) => {
  const { t } = useTranslation('common');
  const [addToolDialogOpen, setAddToolDialogOpen] = useState(false);
  const [toolDialogData, setToolDialogData] = useState<ToolData | {}>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

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
        await axios.put(
          `/api/router?path=api/tools/${id}`,
          rest
        );
        toast.success("Successfully updated tool");
      } catch (error: any) {
        const errmsg = error?.response?.data?.message;
        toast.error(errmsg || "Something went wrong");
      }
    } else {
      try {
        await axios.post(`/api/router?path=api/tools`, data);
        toast.success("Successfully created tool");
      } catch (error: any) {
        const errmsg = error?.response?.data?.message;
        toast.error(errmsg || "Something went wrong");
      }
    }
    handleClose();
    refetch();
  };

  const hasActiveFilters = Object.values(filters).some((v) => !!v);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#9B2735",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setShowFilters(prev => !prev)}
          >
            {showFilters ? t('common.hideFilters') : t('common.showFilters')}
          </Button>
          <Typography align='left' style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{
                borderRadius: 15,
                backgroundColor: "#9B2735",
                fontSize: "13px"
              }}
              variant="contained"
              onClick={() => setAddToolDialogOpen(true)}
            >
              {t('tool.addTool')}
            </Button>
          </Typography>
        </Box>
        {(showFilters || hasActiveFilters) && (
          <Box sx={{ background: 'white', width: '100%', marginBottom: '16px' }}>
            <ToolTableFilters filtersState={filters} setFilterState={onFiltersChange} />
          </Box>
        )}
        <ToolTable
          toolApidata={toolApidata}
          deleteTool={deleteTool}
          editTool={editTool}
          viewTool={viewTool}
          setPage={setPage}
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
