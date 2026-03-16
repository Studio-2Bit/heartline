import express from 'express';
import { searchDonor, markDonation, getRecentDonations,getMyDonations } from '../controllers/donation.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/search', protect, searchDonor);       // GET search donor by id
router.post('/mark', protect, markDonation);        // POST mark donation
router.get('/recent', protect, getRecentDonations); // GET recent donations


router.get('/my', protect, getMyDonations);


export default router;