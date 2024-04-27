import { useState, type ChangeEvent, type FC, type MouseEvent } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

import { RouterLink } from 'src/components/router-link';
import { Scrollbar } from 'src/components/scrollbar';
import type { SeverityPillColor } from 'src/components/severity-pill';
import { SeverityPill } from 'src/components/severity-pill';
import { paths } from 'src/paths';
import type { Invoice, InvoiceStatus } from 'src/types/invoice';
import { getInitials } from 'src/utils/get-initials';
import { calculateTotals } from 'src/calculations/total-items-calculate';

type GroupedInvoices = {
  [key in InvoiceStatus]: Invoice[];
};

const groupInvoices = (invoices: Invoice[]): GroupedInvoices => {
  return invoices.reduce(
    (acc, invoice) => {
      const { status } = invoice;

      return {
        ...acc,
        [status]: [...acc[status], invoice],
      };
    },
    {
      canceled: [],
      paid: [],
      pending: [],
    }
  );
};

const statusColorsMap: Record<InvoiceStatus, SeverityPillColor> = {
  canceled: 'error',
  paid: 'success',
  pending: 'warning',
};

interface InvoiceRowProps {
  invoice: Invoice;
}

const InvoiceRow: FC<InvoiceRowProps> = (props) => {
  const { invoice, ...other } = props;

  const statusColor = statusColorsMap[invoice.status];

  const [isTvaActive, setIsTvaActive] = useState(true); // Set the initial state based on your logic
  const { totalWithVat } = calculateTotals(invoice?.items ?? [], isTvaActive);
  const issueDate = invoice.issueDate && format(invoice?.issueDate, 'dd/MM/yyyy');
  const dueDate = invoice.dueDate && format(invoice.dueDate, 'dd/MM/yyyy');
  // return;
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      {...other}
    >
      <TableCell width="25%">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          component={RouterLink}
          href={paths.dashboard.invoices.details}
          sx={{
            display: 'inline-flex',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div>
            <Typography
              color="text.primary"
              variant="subtitle2"
            >
              {invoice.customer}
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {invoice.id}
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">MAD {totalWithVat}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">Emise le</Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {issueDate}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">Due le</Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {dueDate}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <SeverityPill color={statusColor}>
          {invoice.status == 'canceled'
            ? 'Impayée'
            : invoice.status == 'paid'
            ? 'payé'
            : 'en attente'}
        </SeverityPill>
      </TableCell>
      <TableCell align="right">
        <IconButton
          component={RouterLink}
          href={paths.dashboard.invoices.edit}
          color="warning"
        >
          <SvgIcon>
            <EditIcon />
          </SvgIcon>
        </IconButton>
        <IconButton
          component={RouterLink}
          href={paths.dashboard.invoices.details}
          color="info"
        >
          <SvgIcon>
            <ArrowRightIcon />
          </SvgIcon>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

InvoiceRow.propTypes = {
  // @ts-ignore
  invoice: PropTypes.object.isRequired,
};

interface InvoiceListTableProps {
  count?: number;
  group?: boolean;
  items?: Invoice[];
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page?: number;
  rowsPerPage?: number;
}

export const InvoiceListTable: FC<InvoiceListTableProps> = (props) => {
  const {
    group = false,
    items = [],
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  let content: JSX.Element;

  if (group) {
    const groupedInvoices = groupInvoices(items);

    const statuses = Object.keys(groupedInvoices) as InvoiceStatus[];

    content = (
      <Stack spacing={6}>
        {statuses.map((status) => {
          const groupTitle = status.charAt(0).toUpperCase() + status.slice(1);
          const count = groupedInvoices[status].length;
          const invoices = groupedInvoices[status];
          const hasInvoices = invoices.length > 0;

          return (
            <Stack
              key={groupTitle}
              spacing={2}
            >
              <Typography
                color="text.secondary"
                variant="h6"
              >
                {groupTitle == 'Paid' ? 'Payés' : groupTitle == 'Pending' ? 'En cours' : 'Impayées'}{' '}
                ({count})
              </Typography>
              {hasInvoices && (
                <Card>
                  <Scrollbar>
                    <Table sx={{ minWidth: 600 }}>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <InvoiceRow
                            key={invoice.id}
                            invoice={invoice}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Card>
              )}
            </Stack>
          );
        })}
      </Stack>
    );
  } else {
    content = (
      <Card>
        <Table>
          <TableBody>
            {items.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <Stack spacing={4}>
      {content}
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page"
      />
    </Stack>
  );
};

InvoiceListTable.propTypes = {
  count: PropTypes.number,
  group: PropTypes.bool,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
