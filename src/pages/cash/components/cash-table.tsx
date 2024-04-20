import { useState, type FC, useCallback, ChangeEvent } from 'react';
import numeral from 'numeral';
import { format, subDays, subHours } from 'date-fns';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import DeleteConfirmationModal from './delete-confirmation';
import toast from 'react-hot-toast';
import CashListRow from './cash-list-row';
import CashListInRow from './cash-in-list-row';
import { Box, Card, Divider } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { dummyCashInData } from 'src/types/cash-in';
import CashListOutRow from './chash-out-list-row';
import { dummyCashOutData } from 'src/types/cash-out';

const now = new Date();

interface Customer {
  id: string;
  avatar: string;
  city: string;
  country: string;
  currency: string;
  email: string;
  hasAcceptedMarketing: boolean;
  isProspect: boolean;
  isReturning: boolean;
  name: string;
  state: string;
  totalSpent: number;
  totalOrders: number;
  updatedAt: number;
}

const customers: Customer[] = [
  {
    id: '5e887ac47eed253091be10cb',
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    city: 'Cleveland',
    country: 'USA',
    currency: '$',
    email: 'carson.darrin@devias.io',
    hasAcceptedMarketing: true,
    isProspect: false,
    isReturning: true,
    name: 'Carson Darrin',
    state: 'Note de frais',
    totalSpent: 300.0,
    totalOrders: 3,
    updatedAt: subDays(subHours(now, 7), 1).getTime(),
  },
  {
    id: '5e887b209c28ac3dd97f6db5',
    avatar: '/assets/avatars/avatar-fran-perez.png',
    city: 'Atlanta',
    country: 'USA',
    currency: '$',
    email: 'fran.perez@devias.io',
    hasAcceptedMarketing: true,
    isProspect: true,
    isReturning: false,
    name: 'Fran Perez',
    state: 'Utilities',
    totalSpent: 1000.0,
    totalOrders: 0,
    updatedAt: subDays(subHours(now, 1), 2).getTime(),
  },
  {
    id: '5e887b7602bdbc4dbb234b27',
    avatar: '/assets/avatars/avatar-jie-yan-song.png',
    city: 'North Canton',
    country: 'USA',
    currency: '$',
    email: 'jie.yan.song@devias.io',
    hasAcceptedMarketing: false,
    isProspect: false,
    isReturning: false,
    name: 'Jie Yan Song',
    state: 'Notes de frais',
    totalSpent: 5600.0,
    totalOrders: 6,
    updatedAt: subDays(subHours(now, 4), 2).getTime(),
  },
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/assets/avatars/avatar-anika-visser.png',
    city: 'Madrid',
    country: 'Spain',
    currency: '$',
    email: 'anika.visser@devias.io',
    hasAcceptedMarketing: true,
    isProspect: false,
    isReturning: true,
    name: 'Anika Visser',
    state: 'Achats & Prestataires',
    totalSpent: 500.0,
    totalOrders: 1,
    updatedAt: subDays(subHours(now, 11), 2).getTime(),
  },
  {
    id: '5e86805e2bafd54f66cc95c3',
    avatar: '/assets/avatars/avatar-miron-vitold.png',
    city: 'San Diego',
    country: 'USA',
    currency: '$',
    email: 'miron.vitold@devias.io',
    hasAcceptedMarketing: true,
    isProspect: true,
    isReturning: false,
    name: 'Achats & Prestataires',
    totalSpent: 3500.0,
    totalOrders: 0,
    state: 'Utilities',
    updatedAt: subDays(subHours(now, 7), 3).getTime(),
  },
];

const tabs = [
  {
    label: 'Entrées',
    value: 'in',
  },
  {
    label: 'Sorties',
    value: 'outs',
  },
];

const TableCash: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('in');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };
  // Replace this with your actual delete function
  const handleDelete = async (projectId: string | undefined) => {
    // Implement the delete logic here
    try {
      toast.success('La tranche a été supprimé avec succès!');
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting member: ', error);
      toast.error('Échec de la suppression. Veuillez réessayer.');
    }
  };
  const handleTabsChange = useCallback((event: ChangeEvent<any>, value: string): void => {
    setCurrentTab(value);
  }, []);

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={handleDeleteCancel}
        message="Êtes vous sûr de vouloir supprimer? Cette action sera irréversible."
      />
      <Card>
        <Tabs
          indicatorColor="primary"
          scrollButtons="auto"
          textColor="primary"
          onChange={handleTabsChange}
          value={currentTab}
          sx={{ px: 3 }}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Divider />

        <Scrollbar>
          {currentTab === 'in' && (
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Projet</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyCashInData.map((cashIn) => {
                  const totalSpent = numeral(cashIn.amount).format(`0,0.00`);
                  const date = format(cashIn.startDate, 'dd/MM/yyyy');
                  return (
                    <CashListInRow
                      key={cashIn.id}
                      id={cashIn.id}
                      amount={totalSpent}
                      projectName={cashIn.projectId}
                      date={date}
                      onDelete={() => handleDeleteClick()}
                    />
                  );
                })}
              </TableBody>
            </Table>
          )}
          {currentTab === 'outs' && (
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Projet</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Motif</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyCashOutData.map((cashOut) => {
                  const totalSpent = numeral(cashOut.amount).format(`0,0.00`);
                  const date = format(cashOut.startDate, 'dd/MM/yyyy');
                  return (
                    <CashListOutRow
                      key={cashOut.id}
                      id={cashOut.id}
                      amount={totalSpent}
                      projectName={cashOut.projectId}
                      motif={cashOut.motif}
                      date={date}
                      onDelete={() => handleDeleteClick()}
                    />
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Scrollbar>
        <TablePagination
          component="div"
          count={customers.length}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          page={0}
          rowsPerPage={5}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Box>
  );
};

export default TableCash;
