import { Chip, Input, Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Image } from "@heroui/react";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function PakejFamily() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [link, setLink] = useState("");
  const [isLoading, setLoading] = useState(false);
  const pakej = [
  {
    title: "Mutiara Kasih",
    price: "RM 150",
    subscription: "Setahun",
    link: "https://www.mykasihjenazah.com/daftarp.php?p=2", 
    detailLink: "https://www.mykasihjenazah.com/assets/images/1MK.png"
  },
  {
    title: "Intan Kasih",
    price: "RM 250",
    subscription: "Setahun",
    link: "https://www.mykasihjenazah.com/daftarp.php?p=2",
    detailLink: "https://www.mykasihjenazah.com/assets/images/2ZK.png"
  },
  {
    title: "Zamrud Kasih",
    price: "RM 200",
    subscription: "Setahun",
    link: "https://www.mykasihjenazah.com/daftarp.php?p=2",
    detailLink: "https://www.mykasihjenazah.com/assets/images/3IK.png"
  },
  {
    title: "Berlian Kasih",
    price: "RM 300",
    subscription: "Setahun",
    link: "https://www.mykasihjenazah.com/daftarp.php?p=2",
    detailLink: "https://www.mykasihjenazah.com/assets/images/4BK.png"
  },
  {
    title: "Pelan Sakinah",
    price: "RM 1,500",
    subscription: "Seumur Hidup",
    link: "https://www.mykasihjenazah.com/assets/images/4BK.png",
    detailLink: ""
  },
];
  
  return (
    <>
    <div className="flex items-center gap-2 grid lg:grid-cols-4 grid-cols-2">
      {pakej.map((item) => (
        <Card className={`w-full dark:bg-default-100/50 p-2 shadow-sm h-full border-1 border-default-200 overflow-hidden ${
          item.title === "Zamrud Kasih" ? "col-span-2" : ""
        }`} isBlurred key={item.title}>
          <CardHeader className="flex items-center justify-center p-0 overflow-hidden">
            <h1 className="font-bold">{item.title}</h1>
            </CardHeader>
          <Divider />
          <CardBody className="flex items-center justify-start overflow-hidden">
            <h1 className="font-bold">{item.price}</h1>
            <p className="text-xs mb-2">{item.subscription}</p>
            <Link isExternal href={item.link}>
              <Button variant="shadow" color="secondary" size="sm">Sertai Sekarang</Button>
            </Link>
          </CardBody>
          <CardFooter className="p-0 flex items-center justify-center overflow-hidden">
            <Link className={item.detailLink === "" ? "hidden" : "max-w-fit cursor-pointer text-xs text-foreground"} onPress={onOpen}>
              <Chip size="sm" radius="sm" variant="bordered" endContent={<Icon icon="material-symbols:arrow-right-alt-rounded" />} 
              onClick={() => setLink(item.detailLink)}>
                Lihat Perincian
              </Chip>
            </Link>
          </CardFooter>
            <Icon icon="line-md:star-twotone" className={`absolute top-1 right-1 text-warning shadow-sm shadow-warning bg-warning rounded-full text-white animate-pulse ${item.title === "Zamrud Kasih" ? "block" : "hidden"}`}/>
        </Card>
      ))}
      </div>

      <Modal isOpen={isOpen} placement={"center"} onOpenChange={onOpenChange} size={"4xl"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Mutiara Kasih</ModalHeader>
              <ModalBody>
                <Image src={link} alt="pakej1" className="w-full h-full"/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}