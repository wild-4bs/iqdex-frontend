<script setup>
const dashboardStore = useMyDashboardStore()
const usersStore = useMyUsersStore()
const { timeAgo } = useDateHelpers()
const router = useRouter()
</script>

<template>
  <Table class="table min-w-[1500px]">
    <TableCaption>A list of your users.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="text-center">Picture</TableHead>
        <TableHead class="text-center">Name</TableHead>
        <TableHead class="text-center">Date</TableHead>
        <TableHead class="text-center">Participation Type</TableHead>
        <TableHead class="text-center">Position</TableHead>
        <TableHead class="text-center">Company</TableHead>
        <TableHead class="text-center">Phone number</TableHead>
        <TableHead class="text-center">Email</TableHead>
        <TableHead class="text-center">Country</TableHead>
        <TableHead class="text-center">Send method</TableHead>
        <TableHead class="text-center">Status</TableHead>
        <TableHead class="text-center">More Details</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="user in dashboardStore.filteredUsers" class="cursor-pointer" :key="user.id">
        <TableCell class="text-center" v-if="user.image[0]"><img :src="user.image[0].url" alt=""></TableCell>
        <TableCell class="text-center">{{ user.first_name + ' ' + user.last_name }}</TableCell>
        <TableCell class="text-center">{{ timeAgo(user.created_at) }}</TableCell>
        <TableCell class="text-center">{{ user.participation_type }}</TableCell>
        <TableCell class="text-center">{{ user.position }}</TableCell>
        <TableCell class="text-center">{{ user.company_name }}</TableCell>
        <TableCell class="text-center">{{ user.phone_number }}</TableCell>
        <TableCell class="text-center">{{ user.email }}</TableCell>
        <TableCell class="text-center">{{ user.country }}</TableCell>
        <TableCell class="text-center">{{ user.send_via }}</TableCell>
        <TableCell :class="['status text-center', user.status]">
          <span class="circle"></span>
          <span>{{ user.status }}</span>
        </TableCell>
        <TableCell class="moreOptions text-center z-10 relative">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div class="icon flex items-center justify-center">
                <Icon name="ic:outline-more-horiz" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent :class="`${!usersStore.canDoActions ? 'bg-gray-100' : ''}`">
              <DropdownMenuItem v-if="user.status != 'rejected'" @click="usersStore.rejectUser(user.id)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">Reject
              </DropdownMenuItem>
              <DropdownMenuItem v-if="user.status != 'accepted'" @click="usersStore.acceptUser(user.id)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">Accept
              </DropdownMenuItem>
              <DropdownMenuItem @click="usersStore.sendPdfByWhatsapp(user.id)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">
                Send Whatsapp</DropdownMenuItem>
              <DropdownMenuItem @click="usersStore.sendPdfByEmail(user.id)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">Send Email</DropdownMenuItem>
              <DropdownMenuItem @click="usersStore.downloadPdf(user)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">Download Badge</DropdownMenuItem>
              <DropdownMenuItem @click="router.push(`/dashboard/users/${user.id}`)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">Edit</DropdownMenuItem>
              <DropdownMenuItem @click="usersStore.DeleteUser(user.id)"
                :class="`${!usersStore.canDoActions ? 'cursor-not-allowed' : ''}`">Delete User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style scoped lang="scss">
img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin: auto;
  border-radius: 4px;
}

.status {
  span {
    text-transform: capitalize;
    font-size: .85rem;
  }

  .circle {
    text-transform: capitalize;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
    transform: translateY(20%);
  }

  &.pending {
    .circle {
      color: white;
      background-color: #F7CB73;
    }
  }

  &.rejected {
    .circle {
      color: white;
      background-color: #f60303a6;
    }
  }

  &.accepted {
    .circle {
      color: white;
      background-color: #12BF0C;
    }
  }
}

.moreOptions {
  .icon {
    width: 30px;
    margin: auto;
    height: 30px;
    border-radius: 50%;
    font-size: 20px;
    transition: .2s;

    &:hover {
      background-color: rgb(218, 218, 218);
    }
  }
}
</style>