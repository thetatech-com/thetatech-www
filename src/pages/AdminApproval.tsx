import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface SellerRequest {
  id: string;
  username: string | null;
  full_name: string | null;
  seller_request_status: string;
  created_at: string;
}

const AdminApproval = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchRequests();
    }
  }, [isAdmin, adminLoading]);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, seller_request_status, created_at')
      .eq('seller_request_status', 'pending');

    if (error) {
      toast({ title: 'Error fetching requests', description: error.message, variant: 'destructive' });
    } else if (data) {
      setRequests(data as any);
    }
    setLoading(false);
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    const status = approve ? 'approved' : 'rejected';
    const { error } = await supabase
      .from('profiles')
      .update({ seller_request_status: status, is_seller: approve })
      .eq('id', userId);

    if (error) {
      toast({ title: `Error ${status} seller`, description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Seller ${status}` });
      setRequests(requests.filter((req) => req.id !== userId));
    }
  };

  if (adminLoading || loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending Seller Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.username}</TableCell>
                    <TableCell>{req.full_name}</TableCell>
                    <TableCell>{new Date(req.created_at).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="secondary">{req.seller_request_status}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => handleApproval(req.id, true)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleApproval(req.id, false)}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No pending approvals.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApproval;
