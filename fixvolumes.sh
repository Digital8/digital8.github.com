#!/bin/bash

# strip the /mnt lines from fstab as we will be rebuilding them
grep /mnt /etc/fstab -v > _fstab

# create the new volumes.xml file
echo -e "<?xml version=\"1.0\" ?>\n<volumes>" > _volumes.xml

# find all logical volumes and loop
for i in `lvdisplay | grep "LV Name" | sed 's/[^\/]*//'`; do
        fstype=`blkid -o value -s TYPE $i`;
        mntpoint=`echo $i | sed 's/\/dev\//\/mnt\//'`/
        vgname=`echo $i | cut -d '/' -f3`
        volid=`echo $i | cut -d '/' -f4`

        args="";
        if [ "$fstype" == "" ]; then
                # assume iscsi since filesystem is unknown
                fstype="iscsi"
                mntpoint=""
        fi
        if [ $fstype == ext3 ] ; then
                args=",acl,user_xattr"
        fi

        if [ $fstype == reiserfs ] ; then
                args=",acl"
        fi

        if [ $fstype == xfs ] ; then
                args=""
        fi

        if [ $fstype != "iscsi" ]; then
                echo "$i $mntpoint $fstype defaults,usrquota,grpquota$args 0 0" >> _fstab
                echo "  <volume id=\"$volid\" name=\"$volid\" mountpoint=\"$mntpoint\" vg=\"$vgname\" fstype=\"$fstype\" />" >> _volumes.xml

                echo "Mounting $mntpoint"
                mkdir -p $mntpoint > /dev/null 2> /dev/null
                umount $mntpoint 2> /dev/null
                mount $mntpoint
        else
                echo "$i - assuming iSCSI"
                echo "  <volume id=\"$volid\" name=\"$volid\" mountpoint=\"\" vg=\"$vgname\" fstype=\"$fstype\" />" >> _volumes.xml
        fi
done;
echo "</volumes>" >> _volumes.xml

mv -f _fstab /etc/fstab
mv -f _volumes.xml /opt/openfiler/etc/volumes.xml
chown openfiler.openfiler /opt/openfiler/etc/volumes.xml
