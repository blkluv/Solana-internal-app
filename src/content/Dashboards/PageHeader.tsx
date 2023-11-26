import PersonalPin from '@/components/Modal/PersonalPin';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Send } from '@mui/icons-material';
import AddAlertTwoToneIcon from '@mui/icons-material/AddAlertTwoTone';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
  alpha,
  lighten,
  styled
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SendUserSol from './SendUserSol';

const AvatarPageTitle = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      color: ${theme.colors.primary.main};
      margin-right: ${theme.spacing(2)};
      background: ${
        theme.palette.mode === 'dark'
          ? theme.colors.alpha.trueWhite[10]
          : theme.colors.alpha.white[50]
      };
      box-shadow: ${
        theme.palette.mode === 'dark'
          ? '0 1px 0 ' +
            alpha(lighten(theme.colors.primary.main, 0.8), 0.2) +
            ', 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)'
          : '0px 2px 4px -3px ' +
            alpha(theme.colors.alpha.black[100], 0.4) +
            ', 0px 5px 16px -4px ' +
            alpha(theme.colors.alpha.black[100], 0.2)
      };
`
);

function PageHeader() {
  const wallet = useWallet();

  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();
  const [open, setOpen] = useState(false);
  const [personalPin, setPersonalPin] = useState('');
  const [isValidPPin, setIsValidPPin] = useState(false);

  const handleClickOpen = () => {
    if (!wallet.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsValidPPin(false);
  };

  function handleVerifyPPin() {
    setIsValidPPin(true);
    toast.success('Correct Personal Pin!');
  }

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  return (
    <Box
      display="flex"
      alignItems={{ xs: 'stretch', md: 'center' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center">
        <AvatarPageTitle variant="rounded">
          <AddAlertTwoToneIcon fontSize="large" />
        </AvatarPageTitle>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            <Stack direction="row" gap={1}>
              Welcome,
              {isMeLoading ? (
                <Skeleton variant="rectangular" width={200} />
              ) : (
                <span>{user.name || 'User'}</span>
              )}
              !
            </Stack>
          </Typography>
          <Typography variant="subtitle2">
            Manage your aliases and contacts in a highly secure environment!
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" gap={2} flexWrap="wrap" mt={3}>
        <Button
          variant="contained"
          endIcon={<Send sx={{ ml: '0.75rem' }} />}
          onClick={handleClickOpen}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            Send{' '}
            <Image
              src="/static/images/logo/SOL.svg"
              width={20}
              height={20}
              alt="Solana"
            />
          </Stack>
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Send SOL</DialogTitle>

          <DialogContent>
            <DialogContentText mb={3}>
              Search User -{'>'} Enter Amount -{'>'} Send
            </DialogContentText>
            {isValidPPin ? (
              <SendUserSol handleCloseDialog={handleClose} />
            ) : (
              <>
                <PersonalPin
                  personalPin={personalPin}
                  setPersonalPin={setPersonalPin}
                />
                <Button
                  onClick={handleVerifyPPin}
                  sx={{ ml: 'calc(100% - 7rem)', mt: '1rem' }}
                  color="success"
                  endIcon={<ArrowForwardIosIcon />}
                >
                  Next
                </Button>
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}

export default PageHeader;
